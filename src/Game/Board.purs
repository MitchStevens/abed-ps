module Game.Board where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.State (class MonadState, evalState, get, gets)
import Data.Align (align)
import Data.Array (foldr, (..))
import Data.Array as A
import Data.Foldable (intercalate, surround)
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.Group (ginverse)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.List (List(..), any, foldMap, (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Map.Internal as Map
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, isJust, maybe)
import Data.Monoid (power)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.Set as S
import Data.Traversable (for, sequence, traverse)
import Data.Tuple (Tuple(..))
import Data.Unfoldable (replicate)
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection, allDirections, oppositeDirection, rotateDirection)
import Game.Direction as Direction
import Game.Edge (Edge(..), edge, matchEdge)
import Game.Location (Location(..), location)
import Game.Piece (class Piece, PieceId(..), Port, PortType, eval, getCapacity, getOutputDirs, getPort, getPorts, isInput, name, portCapacity, portType, toInt)
import Game.Piece.APiece (APiece(..))
import Game.Piece.Port as Port
import Game.Rotation (Rotation(..))
import Game.Signal (Signal(..))
import Halogen.Svg.Attributes (m)
import Type.Proxy (Proxy(..))


{-
  Edges are references to ports, they contain a location and a direction
  We have two different types of edges to
-}
type AbsoluteEdge = Edge

newtype RelativeEdge = Relative Edge
derive instance Newtype RelativeEdge _
derive instance Eq RelativeEdge
derive instance Ord RelativeEdge
instance Show RelativeEdge where
  show (Relative (Edge { loc, dir })) = "(RelEdge " <> show loc <> " " <> show dir <> ")"

relative :: Location -> CardinalDirection -> RelativeEdge
relative loc dir = Relative (Edge {loc, dir})

relativeEdgeLocation :: RelativeEdge -> Location
relativeEdgeLocation (Relative (Edge {loc, dir})) = loc

relativeEdgeDirection :: RelativeEdge -> CardinalDirection
relativeEdgeDirection (Relative (Edge {loc, dir})) = dir

absolute :: Location -> CardinalDirection -> AbsoluteEdge
absolute = edge 

type PieceInfo =
  { piece :: APiece
  , rotation :: Rotation 
  }

_rotation :: Lens' PieceInfo Rotation
_rotation = prop (Proxy :: Proxy "rotation")

newtype Board = Board
  { size :: Int
  , pieces :: Map Location PieceInfo
  }

derive instance Newtype Board _
derive instance Eq Board
instance Show Board where
  show = printBoard

_size :: Lens' Board Int
_size = _Newtype <<< prop (Proxy :: Proxy "size")

_pieces :: Lens' Board (Map Location PieceInfo)
_pieces = _Newtype <<< prop (Proxy :: Proxy "pieces")

standardBoard :: Board
standardBoard = Board { size: 3, pieces: M.empty }

toLocalInputs :: forall a. Location -> Map RelativeEdge a -> Map CardinalDirection a
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey relativeEdgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: forall a. Location -> Map CardinalDirection a -> Map RelativeEdge a
toGlobalInputs loc = unsafeMapKey (relative loc)

allOccupiedLocations :: Board -> Set Location
allOccupiedLocations = view $ _pieces <<< to M.keys

-- todo: ensure that this short circuits when the empty loction is found 
firstEmptyLocation :: Board -> Maybe Location
firstEmptyLocation board = do
  let n = view _size board
  let allLocations = do
        j <- 0 .. (n - 1)
        i <- 0 .. (n - 1)
        pure $ location i j
  let occupied = allOccupiedLocations board
  A.find (\loc -> S.member loc occupied) allLocations


{-
  would be nice to print a graphical version of the board
 +━━━━∧ 
 ┃    1    ┃
 > 1     1 >
 ┃    1    ┃
 +━━━━∨ ━━━+
-}
printBoard :: Board -> String
printBoard (Board b) = "SHOW BOARD\n" <> (foldMap (_ <> "\n") $ interleave colEdges rows )
  where
    rows = L.range 0 (b.size - 1) <#> \x -> printRow x
    colEdges = L.range 0 b.size <#> \y -> 
      surround "+" $ (L.range 0 (b.size - 1)) <#> \x -> printColEdge x y

    printPiece :: Map CardinalDirection Port -> Rotation -> Location -> List String
    printPiece ports rot loc = L.fromFoldable
      [ "   " <> port Direction.Up <> "   "
      , port Direction.Left <> " " <> printLocation loc <> " " <> port Direction.Right
      , "   " <> port Direction.Down <> "   "
      ]
      where
        port :: CardinalDirection -> String
        port dir = 
          let dir' = rotateDirection dir (ginverse rot)
          in maybe " " (printPort dir) (M.lookup dir' ports)
    
    printLocation :: Location -> String
    printLocation (Location {x, y}) = show x <> "," <> show y

    printRow :: Int -> String
    printRow y = intercalate "\n" $ L.foldr (L.zipWith append) (replicate 3 "")  $ interleave edges pieces
      where
        pieces =
          L.range 0 (b.size - 1) <#> \x -> 
            let loc = location x y
            in case M.lookup loc b.pieces of
              Just { piece, rotation } -> printPiece (getPorts piece) rotation loc
              Nothing -> L.fromFoldable ["       ", "  " <> printLocation loc <> "  ", "       " ]

        edges = L.range 0 b.size <#> \x -> printRowEdge x y
    

    printPort :: CardinalDirection -> Port -> String
    printPort dir port = case if isInput port then oppositeDirection dir else dir of
      Direction.Up -> "∧"
      Direction.Right -> ">"
      Direction.Down -> "∨"
      Direction.Left -> "<"
    
    printRowEdge :: Int -> Int -> List String
    printRowEdge 0 _ = replicate 3 "┃"
    printRowEdge x y = replicate 3 "┃" -- todo:

    printColEdge :: Int -> Int -> String
    printColEdge _ 0 = power "━" 7
    printColEdge x y = power "━" 7 --todo:

    interleave :: forall a. List a -> List a -> List a
    interleave (Cons x xs) (Cons y ys) = Cons x $ Cons y (interleave xs ys)
    interleave Nil ys = ys
    interleave xs Nil = xs


