module Component.Board.Render
  ( render
  )
  where

import Prelude

import AppM (AppM)
import Component.Board.Types (Action(..), Slots, State, boardPortInfo, slot)
import Component.DataAttribute as DA
import Component.GameEventLogger as GameEventLogger
import Component.Multimeter as Multimeter
import Component.Piece as Piece
import Component.Rendering.Path (renderPathWithEvents)
import Component.Rendering.Port (portPath)
import Control.Monad.State (evalState)
import Data.Array (elem, (..))
import Data.Array as A
import Data.Either (hush)
import Data.Foldable (foldMap, intercalate)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens ((^.))
import Data.Maybe (maybe)
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

render :: State -> HTML (ComponentSlot Slots AppM Action) Action
render state =
  HH.div
    [ HP.id "board-component"
    , HE.onDragExit (BoardOnDragExit)
    , HP.style $ intercalate "; "
      [ "grid-template-columns: " <> gridTemplate
      , "grid-template-rows:    " <> gridTemplate
      ]
    ] $
    join
      [ pieces
      , boardPorts
      , [ multimeter ]
      ]
  where
    gridTemplate = "25fr repeat(" <> show n <> ", 100fr) 25fr"
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
        , HP.style $ intercalate "; "
          [ --"transform: rotate("<> (show (rot * 90)) <>"deg)"
          --, 
          gridArea (Tuple i j )
          ]
        , HE.onMouseDown (LocationOnMouseDown loc)
        , HE.onMouseOver (LocationOnMouseOver loc)
        , HE.onMouseUp (LocationOnMouseUp loc)
        , HE.onDragEnter (LocationOnDragEnter loc)
        , HE.onDragOver (LocationOnDragOver loc)
        , HE.onDragLeave LocationOnDragLeave
        , HE.onDrop (LocationOnDrop loc)
        ]

        [ maybe emptyPieceHTML pieceHTML maybePiece loc ]
      where
        loc = location i j
        eitherPieceInfo = evalBoardM (getPieceInfo loc) board
        maybePiece = (_.piece) <$> hush eitherPieceInfo
        Rotation rot = foldMap (_.rotation) eitherPieceInfo
    
    --boardPorts :: forall p. Array (HTML p Action)
    boardPorts = A.fromFoldable $
      mapWithIndex renderBoardPort (evalState boardPortInfo state)

    renderBoardPort :: CardinalDirection -> PortInfo -> ComponentHTML Action Slots AppM
    renderBoardPort dir portInfo = 
      HH.div
        [ HP.class_ (ClassName "board-port")
        , HE.onClick (\_ -> ToggleInput dir)
        , DA.attr DA.direction dir
        , HP.style $ intercalate "; "
          [ gridArea (boardPortLocation dir) ]
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

        boardPortLocation :: CardinalDirection -> Tuple Int Int
        boardPortLocation = case _ of
          Direction.Left    -> Tuple (-1) (n `div` 2)
          Direction.Right  -> Tuple n (n `div` 2)
          Direction.Up  -> Tuple (n `div` 2) (-1)
          Direction.Down -> Tuple (n `div` 2) n

        viewBox =
          if dir `elem` [Direction.Up, Direction.Down]
            then SA.viewBox 0.0 0.0 50.0 25.0
            else SA.viewBox 12.5 (-12.5) 25.0 50.0

    gridArea :: Tuple Int Int -> String
    gridArea (Tuple i j) = 
      "grid-area: " <> show (j+2) <> " / " <> show (i+2)

    pieceHTML piece location =
        HH.slot Piece.slot location Piece.component { piece, location } PieceOutput
    
    emptyPieceHTML (Location {x, y}) =
      HH.div 
        [ HP.class_ (ClassName "location-text") ]
        [ HH.text (show (x+1) <> "," <> show (y+1)) ]

    multimeter = HH.slot Multimeter.slot unit Multimeter.component {} MultimeterOutput
