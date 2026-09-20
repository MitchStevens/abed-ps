module Test.Game.Board.Compiled where

import Prelude

import Data.Either (Either(..))
import Data.List (List(..))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Board (Board, BoardError(Cyclic), BoardF(BoardF), mkBoard, pureBoard, standardBoard)
import Game.Board.Compiled (CompiledBoard(..), PieceIndex, compile)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Location (location)
import Game.Piece (Piece, PieceId(..), idPiece, mkPieceNoAdapt, superPiece)
import Game.Port (inputPort, noPort, outputPort)
import Game.Rotation (rotation)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

-- | A single-input, single-output piece that just passes its input straight
-- | through, for wiring up an arbitrary loop -- see "a cyclic board" below.
ringPiece :: String -> CardinalDirection -> CardinalDirection -> Piece
ringPiece name inputDir outputDir = mkPieceNoAdapt
  { name: PieceId name
  , eval: \inputs -> Frame.singleton zero outputDir (Frame.index inputDir inputs)
  , ports: Frame.fromFoldable noPort [ Tuple inputDir (inputPort OneBit), Tuple outputDir (outputPort OneBit) ]
  , complexity: mempty
  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

spec :: Spec Unit
spec = describe "Game.Board.Compiled" do
  describe "compile" do
    it "compiles an empty board to an empty CompiledBoard" do
      compile standardBoard `shouldEqual` Right (CompiledBoard
        { pieces: M.empty
        , ports: pure noPort
        , boundaryPorts: M.empty
        , layerDecomposition: Nil
        , frames: M.empty
        , wormholes: Nil
        })

    it "compiles a single super piece alone on a size-1 board" do
      let
        loc = location 0 0
        idx = L.singleton loc

        board :: Board
        board = mkBoard $ BoardF
          { size: 1
          , ports: pure noPort
          , pieces: M.singleton loc { rotation: rotation 0, piece: pureBoard superPiece }
          , wormhole: Nothing
          }

      compile board `shouldEqual` Right (CompiledBoard
        { pieces: M.singleton idx superPiece
        , ports: pure noPort
        -- no neighbors on a 1x1 board, so all 4 of the piece's ports are
        -- genuine boundary ports, regardless of the board declaring none
        -- of its own (`ports: pure noPort` above) -- `boundaryPorts` is
        -- structural, not gated by what the board declares.
        , boundaryPorts: M.fromFoldable
            [ Tuple Direction.Left (Tuple idx Direction.Left)
            , Tuple Direction.Up (Tuple idx Direction.Up)
            , Tuple Direction.Right (Tuple idx Direction.Right)
            , Tuple Direction.Down (Tuple idx Direction.Down)
            ]
        -- one piece, so one layer containing just it
        , layerDecomposition: L.singleton (L.singleton idx)
        -- no neighbors on a 1x1 board, so every one of the piece's own
        -- ports (its only input, Left; its three outputs, Up/Right/Down)
        -- is a true boundary port with nothing to match against -- each
        -- frames to its own edge.
        , frames: M.singleton idx $ M.fromFoldable
            [ Tuple Direction.Left (Tuple idx Direction.Left)
            , Tuple Direction.Up (Tuple idx Direction.Up)
            , Tuple Direction.Right (Tuple idx Direction.Right)
            , Tuple Direction.Down (Tuple idx Direction.Down)
            ]
        , wormholes: Nil
        })

    it "compiles a piece nested two boards deep" do
      let
        outerLoc = location 0 0
        innerLoc = location 0 0
        deepIdx = Cons outerLoc (L.singleton innerLoc)

        -- the inner board declares the same 4 ports `superPiece` actually
        -- has, so from the outer board's point of view it looks just like
        -- any other piece sitting at `outerLoc`.
        superPiecePorts = Frame.fromFoldable noPort
          [ Tuple Direction.Left (inputPort OneBit)
          , Tuple Direction.Up (outputPort OneBit)
          , Tuple Direction.Right (outputPort OneBit)
          , Tuple Direction.Down (outputPort OneBit)
          ]

        innerBoard :: Board
        innerBoard = mkBoard $ BoardF
          { size: 1
          , ports: superPiecePorts
          , pieces: M.singleton innerLoc { rotation: rotation 0, piece: pureBoard superPiece }
          , wormhole: Nothing
          }

        outerBoard :: Board
        outerBoard = mkBoard $ BoardF
          { size: 1
          , ports: pure noPort
          , pieces: M.singleton outerLoc { rotation: rotation 0, piece: innerBoard }
          , wormhole: Nothing
          }

      -- same shape as the single-piece case, just addressed two locations
      -- deep instead of one -- `pieces` and `layerDecomposition` thread
      -- straight through the nesting.
      compile outerBoard `shouldEqual` Right (CompiledBoard
        { pieces: M.singleton deepIdx superPiece
        , ports: pure noPort
        -- `outerLoc` genuinely is a boundary on all 4 sides (no neighbors
        -- on a 1x1 board), but it isn't a leaf -- same documented gap as
        -- `frames` below, `resolvePortIndex` can't resolve a boundary edge
        -- landing on a nested board, so `ownBoundaryPorts` drops it too.
        , boundaryPorts: M.empty
        , layerDecomposition: L.singleton (L.singleton deepIdx)
        -- `frames` only got as far as the inner board's own `combine` call,
        -- which -- exactly like the single-piece case -- has no neighbor
        -- for any of `superPiece`'s 4 ports, so each still frames to its
        -- own (now deeply-addressed) edge. The *outer* board's own view of
        -- `outerLoc` (also self-referential, since it has no neighbor
        -- either) never makes it in: `outerLoc` isn't a leaf, so
        -- `combine`'s `ownFrames` silently drops it -- the documented gap
        -- for a `RelativeEdge` that lands on a nested board.
        , frames: M.singleton deepIdx $ M.fromFoldable
            [ Tuple Direction.Left (Tuple deepIdx Direction.Left)
            , Tuple Direction.Up (Tuple deepIdx Direction.Up)
            , Tuple Direction.Right (Tuple deepIdx Direction.Right)
            , Tuple Direction.Down (Tuple deepIdx Direction.Down)
            ]
        , wormholes: Nil
        })

    it "compiles three wire pieces in a row, connected to each other" do
      let
        loc0 = location 0 1
        loc1 = location 1 1
        loc2 = location 2 1
        idx0 = L.singleton loc0
        idx1 = L.singleton loc1
        idx2 = L.singleton loc2

        board :: Board
        board = mkBoard $ BoardF
          { size: 3
          , ports: pure noPort
          , pieces: M.fromFoldable
              [ Tuple loc0 { rotation: rotation 0, piece: pureBoard idPiece }
              , Tuple loc1 { rotation: rotation 0, piece: pureBoard idPiece }
              , Tuple loc2 { rotation: rotation 0, piece: pureBoard idPiece }
              ]
          , wormhole: Nothing
          }

      compile board `shouldEqual` Right (CompiledBoard
        { pieces: M.fromFoldable
            [ Tuple idx0 idPiece
            , Tuple idx1 idPiece
            , Tuple idx2 idPiece
            ]
        , ports: pure noPort
        -- loc0's Left and loc2's Right have no neighbor to match against,
        -- so they're the row's two boundary ports -- loc1 is fully interior
        , boundaryPorts: M.fromFoldable
            [ Tuple Direction.Left (Tuple idx0 Direction.Left)
            , Tuple Direction.Right (Tuple idx2 Direction.Right)
            ]
        -- each piece's input depends on its left neighbor's output, so the
        -- three pieces chain in a straight line: one piece per layer
        , layerDecomposition: L.fromFoldable [ L.singleton idx0, L.singleton idx1, L.singleton idx2 ]
        -- an input frames to whatever feeds it -- the piece's own edge when
        -- there's no neighbor (loc0's Left, on the board boundary), or the
        -- neighbor's Right (output) port's own `PortIndex` otherwise; a
        -- Right (output) always frames to itself
        , frames: M.fromFoldable
            [ Tuple idx0 $ M.fromFoldable
                [ Tuple Direction.Left (Tuple idx0 Direction.Left)
                , Tuple Direction.Right (Tuple idx0 Direction.Right)
                ]
            , Tuple idx1 $ M.fromFoldable
                [ Tuple Direction.Left (Tuple idx0 Direction.Right)
                , Tuple Direction.Right (Tuple idx1 Direction.Right)
                ]
            , Tuple idx2 $ M.fromFoldable
                [ Tuple Direction.Left (Tuple idx1 Direction.Right)
                , Tuple Direction.Right (Tuple idx2 Direction.Right)
                ]
            ]
        , wormholes: Nil
        })

    it "matches a rotated piece's ports by their absolute (grid) facing, not their canonical direction" do
      let
        top = location 0 0
        bottom = location 0 1
        topIdx = L.singleton top
        bottomIdx = L.singleton bottom

        -- rotated a quarter-turn clockwise, `idPiece`'s canonical Left
        -- (input) now faces absolute Up and its Right (output) now faces
        -- absolute Down -- the same shape as "three wire pieces in a row"
        -- above, just turned 90 degrees into a column instead of a row.
        board :: Board
        board = mkBoard $ BoardF
          { size: 2
          , ports: pure noPort
          , pieces: M.fromFoldable
              [ Tuple top { rotation: rotation 1, piece: pureBoard idPiece }
              , Tuple bottom { rotation: rotation 1, piece: pureBoard idPiece }
              ]
          , wormhole: Nothing
          }

      compile board `shouldEqual` Right (CompiledBoard
        { pieces: M.fromFoldable [ Tuple topIdx idPiece, Tuple bottomIdx idPiece ]
        , ports: pure noPort
        -- top's Left (canonical) faces absolute Up with nothing above it;
        -- bottom's Right (canonical) faces absolute Down with nothing
        -- below it -- both genuine, rotation-resolved boundary ports.
        , boundaryPorts: M.fromFoldable
            [ Tuple Direction.Up (Tuple topIdx Direction.Left)
            , Tuple Direction.Down (Tuple bottomIdx Direction.Right)
            ]
        , layerDecomposition: L.fromFoldable [ L.singleton topIdx, L.singleton bottomIdx ]
        , frames: M.fromFoldable
            [ Tuple topIdx $ M.fromFoldable
                [ Tuple Direction.Left (Tuple topIdx Direction.Left)
                , Tuple Direction.Right (Tuple topIdx Direction.Right)
                ]
            -- the bottom piece's canonical Left (its input) faces absolute
            -- Up, straight at the top piece's canonical Right (its output,
            -- facing absolute Down) -- if rotation were ignored, this would
            -- instead try to match at location (-1,1) and find nothing.
            , Tuple bottomIdx $ M.fromFoldable
                [ Tuple Direction.Left (Tuple topIdx Direction.Right)
                , Tuple Direction.Right (Tuple bottomIdx Direction.Right)
                ]
            ]
        , wormholes: Nil
        })

    it "compiles a cyclic board to Left Cyclic instead of crashing" do
      let
        -- a minimal cycle needs 4 cells -- grid adjacency is bipartite, so
        -- no odd-length cycle (in particular no 2- or 3-cycle) is possible.
        -- Each piece reads the previous one going clockwise around the
        -- 2x2 ring and writes to the next: A depends on D, D on C, C on B,
        -- B on A -- so nothing is ever "ready" and `layerDecomposition`
        -- comes back `Nothing` on its very first pass.
        locA = location 0 0
        locB = location 1 0
        locC = location 1 1
        locD = location 0 1

        board :: Board
        board = mkBoard $ BoardF
          { size: 2
          , ports: pure noPort
          , pieces: M.fromFoldable
              [ Tuple locA { rotation: rotation 0, piece: pureBoard (ringPiece "ring-a" Direction.Down Direction.Right) }
              , Tuple locB { rotation: rotation 0, piece: pureBoard (ringPiece "ring-b" Direction.Left Direction.Down) }
              , Tuple locC { rotation: rotation 0, piece: pureBoard (ringPiece "ring-c" Direction.Up Direction.Left) }
              , Tuple locD { rotation: rotation 0, piece: pureBoard (ringPiece "ring-d" Direction.Right Direction.Up) }
              ]
          , wormhole: Nothing
          }

      compile board `shouldEqual` Left Cyclic
