module Component.Board.BoardPort where

import Prelude

import AppM (AppM(..))
import Component.DataAttribute as DA
import Component.Rendering.Path (renderPath)
import Component.Rendering.Port (portPath)
import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Control.Monad.State.Class (gets, modify_, put)
import Data.Array (elem, intercalate)
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection, clockwiseRotation)
import Game.Direction as Direction
import Game.Location (Location(..))
import Game.Port (portCapacity)
import Game.PortInfo (PortInfo)
import Game.Rotation (toDegrees)
import Game.Signal (Base(..), Signal, SignalRepresentation(..), printSignal)
import GlobalState as GlobalState
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, HalogenQ, defaultEval, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Store.Connect (subscribe)
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Type.Proxy (Proxy(..))

type Input =
  { portInfo :: PortInfo
  , signal :: Signal
  , direction :: CardinalDirection
  }

type State =
  { portInfo :: PortInfo
  , signal :: Signal
  , direction :: CardinalDirection
  , base :: Base
  }

data Action
  = Initialise
  | NewBase Base
  | Receive Input

data Query a

data Output


component :: Component Query Input Output AppM
component = H.mkComponent { initialState: initialState Binary, render, eval }
  where
    initialState base { portInfo, direction, signal } = 
      { portInfo, direction, signal, base }

    render :: State -> ComponentHTML Action () AppM
    render state =
      HH.div
        [ HP.class_ (ClassName "board-port")
        --, HE.onClick (\_ -> ToggleInput direction)
        , DA.attr DA.direction state.direction
        , HP.style (gridLayoutStyle (gridLayoutBoardPort state.direction))
        ]
        [ SE.svg
          [ viewBox ]
          [ SE.g 
            [ SA.transform [ Rotate rotation 25.0 12.5 ] ]
            [ renderPath path ]
          ]
        , HH.div
          [ HP.classes [ ClassName "signal" ] ]
          [ HH.text labelText ]
        ]
      where
        rotation = toDegrees (clockwiseRotation Direction.Up state.direction) + 180.0
        path = portPath state.portInfo

        viewBox =
          if state.direction `elem` [ Direction.Up, Direction.Down ]
            then SA.viewBox 0.0 0.0 50.0 25.0
            else SA.viewBox 12.5 (-12.5) 25.0 50.0
        
        labelX = 0.0
        labelY = 0.0
        labelText = printSignal (SignalRepresentation state.base (portCapacity state.portInfo.port)) state.signal -- <> show state.base
    
    eval :: HalogenQ Query Action Input ~> HalogenM State Action () Output AppM
    eval = mkEval $ defaultEval
      { handleAction = handleAction
      , initialize = Just Initialise
      , receive = \input -> Just (Receive input)
      }
      where
        handleAction = case _ of
          Initialise -> do
            subscribe GlobalState.baseSelector NewBase
          NewBase base -> modify_ (_ { base = base })
          Receive input -> do
            base <- gets _.base
            put (initialState base input)

slot = Proxy :: Proxy "boardPort"

gridLayoutBoardPort :: CardinalDirection -> Tuple Int Int
gridLayoutBoardPort = case _ of
  Direction.Left  -> Tuple 1 (m `div` 2 + 1)
  Direction.Right -> Tuple m (m `div` 2 + 1)
  Direction.Up    -> Tuple (m `div` 2 + 1) 1
  Direction.Down  -> Tuple (m `div` 2 + 1) m
  where m = BoardSizeSlider.maxBoardSize + 2

gridLayoutStyle :: Tuple Int Int -> String
gridLayoutStyle (Tuple i j) = intercalate ";"
  [ "grid-column: " <> show i
  , "grid-row: "    <> show j 
  ]