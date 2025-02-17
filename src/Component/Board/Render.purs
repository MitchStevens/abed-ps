module Component.Board.Render
  ( render
  )
  where

import Prelude

import AppM (AppM)
import Component.Board.Types (Action(..), Slots, State, boardPortInfo, pieceInput, slot)
import Component.DataAttribute as DA
import Component.GameEventLogger as GameEventLogger
import Component.Multimeter as Multimeter
import Component.Piece as Piece
import Component.Rendering.Path (renderPathWithEvents)
import Component.Rendering.Port (portPath)
import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Control.Monad.State (evalState)
import Data.Array (elem, replicate, (..))
import Data.Array as A
import Data.Either (hush)
import Data.Foldable (foldMap, intercalate)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens ((^.), (^?))
import Data.Lens.At (at)
import Data.Maybe (fromMaybe, maybe)
import Data.Tuple (Tuple(..))
import Data.Zipper as Z
import Game.Board (_size, evalBoardM, getPieceInfo)
import Game.Direction (CardinalDirection, clockwiseRotation)
import Game.Direction as Direction
import Game.Location (Location(..), location)
import Game.PortInfo (PortInfo)
import Game.Rotation (Rotation(..), toDegrees)
import Halogen.Component (ComponentSlot(..))
import Halogen.HTML (ClassName(..), ComponentHTML, HTML, slot_)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Web.HTML.Event.DragEvent as DragEvent

render :: State -> ComponentHTML Action Slots AppM
render state =
  HH.div
    [ HP.class_ (ClassName "board-component")
    , HE.onDragExit (BoardOnDragExit)
    , HP.style $ intercalate "; "
      [ "grid-template-columns: " <> gridTemplate
      , "grid-template-rows:    " <> gridTemplate
      ]
    ] $
    join
      [ pieces
      , boardPorts
      --, [ multimeter ]
      ]
  where
    gridTemplate = intercalate " " [ "25fr", invisibleCells, visibleCells, invisibleCells, "25fr" ]
      where
        visibleCells = intercalate " " (replicate n "100fr")
        invisibleCells = intercalate " " (replicate ((BoardSizeSlider.maxBoardSize - n) `div` 2) "0fr")



    board = Z.head state.boardHistory
    n = board ^. _size

    pieces :: Array (ComponentHTML Action Slots AppM)
    pieces = do
      i <- 0 .. (n-1)
      j <- 0 .. (n-1)
      pure $ renderPieceSlot i j

    renderPieceSlot :: Int -> Int -> ComponentHTML Action Slots AppM
    renderPieceSlot i j = 
      HH.div
        [ DA.attr DA.location (location i j)
        , HP.class_ (ClassName "piece")
        , HP.style (gridLayoutStyle (pieceGridLayout (Tuple i j)))
        , HE.onMouseDown (LocationOnMouseDown loc)
        , HE.onMouseOver (LocationOnMouseOver loc)
        , HE.onMouseUp (LocationOnMouseUp loc)
        , HE.onDragEnter (LocationOnDragEnter loc)
        , HE.onDragOver (LocationOnDragOver loc)
        , HE.onDragLeave LocationOnDragLeave
        , HE.onDrop (LocationOnDrop loc)
        ]
        [ fromMaybe (emptyPieceHTML loc) do
            input <- pieceInput state loc
            pure $ HH.slot Piece.slot loc Piece.component input PieceOutput
        
        ]
      where
        loc = location i j
    
    --boardPorts :: forall p. Array (HTML p Action)
    boardPorts = A.fromFoldable $
      mapWithIndex renderBoardPort (evalState boardPortInfo state)

    renderBoardPort :: CardinalDirection -> PortInfo -> ComponentHTML Action Slots AppM
    renderBoardPort dir portInfo = 
      HH.div
        [ HP.class_ (ClassName "board-port")
        , HE.onClick (\_ -> ToggleInput dir)
        , DA.attr DA.direction dir
        , HP.style ( gridLayoutStyle (portGridLayout dir))
        ]
        [ SE.svg
          [ viewBox ]
          [ SE.g 
            [ SA.transform [ Rotate rotation 25.0 12.5 ] ]
            [ renderPathWithEvents path (BoardPortOnMouseEnter dir) (BoardPortOnMouseLeave) ]
          ]
        ]
      where
        rotation = toDegrees (clockwiseRotation Direction.Up dir) + 180.0

        path = portPath portInfo

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

    pieceGridLayout :: Tuple Int Int -> Tuple Int Int
    pieceGridLayout (Tuple i j) = Tuple (center + i) (center + j)
      where center = (BoardSizeSlider.maxBoardSize + 2)`div`2 -n`div`2 + 1

    gridLayoutStyle :: Tuple Int Int -> String
    gridLayoutStyle (Tuple i j) = intercalate ";"
      [ "grid-column: " <> show i
      , "grid-row: "    <> show j 
      ]

    --pieceHTML piece location =
    --    HH.slot Piece.slot location Piece.component { piece, location } PieceOutput
    
    emptyPieceHTML (Location {x, y}) =
      HH.div 
        [ HP.class_ (ClassName "location-text") ]
        [ HH.text (show (x+1) <> "," <> show (y+1)) ]

    --multimeter = HH.slot Multimeter.slot unit Multimeter.component {} MultimeterOutput
