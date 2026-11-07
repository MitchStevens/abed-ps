module Component.Board.Render
  ( render
  )
  where

import Prelude

import AppM (AppM)
import Component.Board.Types (Action(..), Slots, State, _board, _zoomed, boardPortInfo, pieceInput, slot, zoomInset, zoomTransform)
import Component.DataAttribute as DA
import Component.Piece.Movement as Piece
import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Data.Array (elem, range, replicate, (..))
import Data.Array as A
import Data.Either (hush)
import Data.Foldable (foldMap, intercalate)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens ((^.), (^?))
import Data.Lens.At (at)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Tuple (Tuple(..))
import Data.Zipper as Z
import Game.Board (Board, Cell(..), _focus, _pieces, _size, evalBoardM, focusIndex, getPieceInfo, isZoomed, zoomOut)
import Component.Piece.Visual as Visual
import Data.List as L
import Game.PortInfo (clampPortInfo)
import Halogen.HTML.Elements.Keyed as HK
import Type.Proxy (Proxy(..))
import Data.Map as M
import Game.Direction (CardinalDirection, clockwiseRotation, oppositeDirection)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Types (defaultPortInfo)
import Game.Location (Location(..), location)
import Game.PortInfo (PortInfo, hasPortInfo)
import Game.Rotation (Rotation(..), rotation, toDegrees)
import Halogen.Component (ComponentSlot(..))
import Halogen.HTML (ClassName(..), ComponentHTML, HTML, slot_)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Render.Colours as Colours
import Render.Port (portPath)
import Render.Segment (renderPathWithFill)
import Web.HTML.Event.DragEvent as DragEvent

-- | Inside the board's frame, one element (`board-zoom`) is the camera: a zoom
-- | animates its transform, carrying everything inside it along. Inside that
-- | is the grid being looked at and, when zoomed in, the board around it
-- | (`renderContext`), placed so its neighbours show in the grid's margins.
-- |
-- | The camera is keyed by where it's looking, so each level of zoom gets a
-- | new one. That's what lets a zoom in end by jumping straight to the board
-- | inside rather than transitioning back from scaled up, and what plays the
-- | grid's fade in.
render :: State -> ComponentHTML Action Slots AppM
render state =
  HK.div
    [ HP.class_ (ClassName "board-component")
    , HE.onDragExit (BoardOnDragExit)
    , HE.onWheel BoardOnWheel
    ]
    [ Tuple ("zoom " <> show (focusIndex zoomedBoard)) $ HH.div
      [ HP.class_ (ClassName "board-zoom")
      , HP.style $ intercalate "; "
        [ "transform: " <> maybe "none" (\a -> zoomTransform n a.inset a.location) state.zoomAnimation
        -- see `State.zoomAnimation`
        , if (_.animate <$> state.zoomAnimation) == Just false then "transition: none" else ""
        ]
      ]
      -- the context comes after the grid so anything looking pieces up by
      -- `data-location` finds the grid's first
      ([ grid ] <> A.fromFoldable (renderContext <$> contextOf zoomedBoard))
    ]
  where
    grid =
      HH.div
        [ HP.classes ([ ClassName "board-grid" ] <> (if state.fadeInGrid then [ ClassName "fade-in" ] else []))
        , HP.style (gridTemplateStyle n)
        ] (pieces <> boardPorts)

    zoomedBoard = state ^. _zoomed
    board = state ^. _board
    zoomed = isZoomed zoomedBoard
    n = board ^. _size

    -- the board one level up, and where the focus sits in it
    contextOf z = do
      hole <- L.last (focusIndex z)
      parent <- zoomOut z
      pure { parent: parent ^. _focus, hole }

    -- Drawn behind the grid, transformed so the hole lines up exactly with
    -- the grid's slots, which leaves its neighbours showing in the grid's
    -- port margins. Only drawn: it takes no events.
    renderContext { parent, hole } =
      HH.div
        [ HP.class_ (ClassName "board-context")
        , HP.style $ gridTemplateStyle np <> "; transform: " <> zoomTransform np (zoomInset n) hole
        ]
        (contextSlot <$> range 0 (np - 1) <*> range 0 (np - 1))
      where
        np = parent ^. _size

        contextSlot i j =
          HH.div
            [ DA.attr DA.location loc
            , HP.class_ (ClassName "piece")
            , HP.style (gridLayoutStyle (pieceGridLayout np (Tuple i j)))
            ]
            (if loc == hole then holeContents else contents)
          where
            loc = location i j
            -- just after zooming in, the board's preview stays under the
            -- grid, fading out as the grid fades in, so the two crossfade
            holeContents =
              if state.fadeInGrid
                then [ renderNestedBoard "context" hole [ ClassName "fading-out" ] board ]
                else []
            contents = case _.piece <$> M.lookup loc (parent ^. _pieces) of
              Just (Leaf _) -> A.fromFoldable (contextPiece loc <$> M.lookup loc state.contextInputs)
              Just (Nested inner) -> [ renderNestedBoard "context" loc [] inner ]
              Nothing -> []

        -- the same layers `Component.Piece.Movement` draws, minus the interaction
        contextPiece loc input =
          HH.div
            [ HP.class_ (ClassName "piece-component") ]
            [ HH.div
                [ HP.style
                    ( "position: absolute; top: 0; left: 0; width: 100%; height: 100%; "
                        <> "transform: rotate(" <> show (toDegrees input.rotation) <> "deg);"
                    )
                ]
                [ HH.slot_ (Proxy :: _ "contextPiece") loc Visual.component
                    { piece: input.piece, portStates: map clampPortInfo input.portStates }
                ]
            ]

    pieces :: Array (ComponentHTML Action Slots AppM)
    pieces =
      renderPieceSlot <$> range 0 (n-1) <*> range 0 (n-1)

    -- the slot being zoomed into or out of right now, whose preview is
    -- shown at full strength while it fills the board
    zoomingInto = _.location <$> state.zoomAnimation

    renderPieceSlot :: Int -> Int -> ComponentHTML Action Slots AppM
    renderPieceSlot i j = 
      HH.div
        [ DA.attr DA.location (location i j)
        , HP.class_ (ClassName "piece")
        , HP.style (gridLayoutStyle (pieceGridLayout n (Tuple i j)))
        , HE.onMouseDown (LocationOnMouseDown loc)
        , HE.onMouseOver (LocationOnMouseOver loc)
        , HE.onMouseUp (LocationOnMouseUp loc)
        , HE.onDragEnter (LocationOnDragEnter loc)
        , HE.onDragOver (LocationOnDragOver loc)
        , HE.onDragLeave LocationOnDragLeave
        , HE.onDrop (LocationOnDrop loc)
        , HE.onWheel (LocationOnWheel loc)
        ]
        [ fromMaybe (emptyPieceHTML loc) do
            input <- pieceInput state loc
            pure $ HH.slot Piece.slot loc Piece.component input PieceOutput
        ]
      where
        loc = location i j
    
    --boardPorts :: forall p. Array (HTML p Action)
    boardPorts = A.fromFoldable $
      mapWithIndex renderBoardPort (Frame.toMapBy hasPortInfo (boardPortInfo state))

    renderBoardPort :: CardinalDirection -> PortInfo -> ComponentHTML Action Slots AppM
    renderBoardPort dir portInfo = 
      HH.div
        ( [ HP.class_ (ClassName "board-port")
          , DA.attr DA.direction dir
          , HP.style ( gridLayoutStyle (portGridLayout dir))
          ]
          -- the board's ports are only the level's inputs at the root
          <> (if zoomed then [] else [ HE.onClick (\_ -> ToggleInput dir) ])
        )
        [ SE.svg
          [ viewBox ]
          [ SE.g
            [ SA.transform [ Rotate rot 25.0 12.5 ] ]
            [ renderPathWithFill fill path ]
          ]
        ]
      where
        rot = toDegrees (clockwiseRotation Direction.Up dir)

        path = portPath portInfo

        fill = if portInfo.signal /= zero then Colours.portOn else Named "none"

        portGridLayout :: CardinalDirection -> Tuple Int Int
        portGridLayout = case _ of
          Direction.Left  -> Tuple 1 (m `div` 2 + 1)
          Direction.Right -> Tuple m (m `div` 2 + 1)
          Direction.Up    -> Tuple (m `div` 2 + 1) 1
          Direction.Down  -> Tuple (m `div` 2 + 1) m
          where m = BoardSizeSlider.maxBoardSize + 2

        viewBox =
          if dir `elem` [Direction.Up, Direction.Down]
            then SA.viewBox 0.0 0.0 50.0 25.0
            else SA.viewBox 12.5 (-12.5) 25.0 50.0

    pieceGridLayout :: Int -> Tuple Int Int -> Tuple Int Int
    pieceGridLayout size (Tuple i j) = Tuple (center + i) (center + j)
      where center = (BoardSizeSlider.maxBoardSize + 2)`div`2 - size`div`2 + 1

    gridTemplateStyle :: Int -> String
    gridTemplateStyle size = intercalate "; "
      [ "grid-template-columns: " <> template
      , "grid-template-rows:    " <> template
      ]
      where
        template = intercalate " " [ "25fr", invisibleCells, visibleCells, invisibleCells, "25fr" ]
        visibleCells = intercalate " " (replicate size "100fr")
        invisibleCells = intercalate " " (replicate ((BoardSizeSlider.maxBoardSize - size) `div` 2) "0fr")

    gridLayoutStyle :: Tuple Int Int -> String
    gridLayoutStyle (Tuple i j) = intercalate ";"
      [ "grid-column: " <> show i
      , "grid-row: "    <> show j 
      ]

    -- no piece to show: either nothing's there, or a nested board is
    emptyPieceHTML loc@(Location {x, y}) = case _.piece <$> M.lookup loc (board ^. _pieces) of
      Just (Nested inner) ->
        renderNestedBoard "grid" loc (if zoomingInto == Just loc then [ ClassName "zooming" ] else []) inner
      Just (Leaf _) -> HH.div_ []
      Nothing ->
        HH.div
          [ HP.class_ (ClassName "location-text") ]
          [ HH.text (show (x+1) <> "," <> show (y+1)) ]

    -- | A nested board, drawn as a miniature grid of the pieces inside it,
    -- | with no signals: just enough to see what's in there. Boards nested
    -- | deeper still are drawn as an empty dashed box.
    renderNestedBoard :: String -> Location -> Array ClassName -> Board -> ComponentHTML Action Slots AppM
    renderNestedBoard grid outer classes inner =
      HH.div
        [ HP.classes ([ ClassName "nested-board" ] <> classes)
        , HP.style ("grid-template-columns: repeat(" <> show ni <> ", 1fr); grid-template-rows: repeat(" <> show ni <> ", 1fr)")
        ]
        (nestedSlot <$> range 0 (ni - 1) <*> range 0 (ni - 1))
      where
        ni = inner ^. _size

        nestedSlot i j =
          HH.div
            [ HP.class_ (ClassName "nested-piece")
            , HP.style ("grid-column: " <> show (i + 1) <> "; grid-row: " <> show (j + 1))
            ]
            case M.lookup loc (inner ^. _pieces) of
              Just { rotation, piece: Leaf piece } ->
                [ HH.div
                    [ HP.style ("width: 100%; height: 100%; transform: rotate(" <> show (toDegrees rotation) <> "deg);") ]
                    [ HH.slot_ (Proxy :: _ "nestedPiece") (Tuple grid (Tuple outer loc)) Visual.component
                        { piece, portStates: defaultPortInfo piece }
                    ]
                ]
              Just { piece: Nested _ } -> [ HH.div [ HP.class_ (ClassName "nested-board") ] [] ]
              Nothing -> []
          where
            loc = location i j
