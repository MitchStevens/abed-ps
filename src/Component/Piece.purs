module Component.Piece where

import Prelude

import Data.Enum (enumFromTo)
import Data.Int (round)
import Data.Lens ((^.))
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log, logShow)
import Game.Location (CardinalDirection, Rotation(..), Location, rotation)
import Game.Location as Direction
import Game.Piece (class Piece, APiece(..), Port(..), getPort, name)
import Game.Piece as Port
import Halogen (ClassName(..), gets)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Web.Event.Event (EventType(..), type_)
import Web.Event.Internal.Types (Event)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.WheelEvent (WheelEvent)
import Web.UIEvent.WheelEvent as WheelEvent

type Input =
  { piece :: APiece
  , location :: Location
  }

type State = Input

data Query a

data Action
  = Initialise
  | OnWheel WheelEvent
  | OnDrop Location DragEvent
  | OnDragLeave DragEvent

data Output
  = Rotated Location Rotation
  | Dropped Location

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState input = input 

  render state =
    HH.div
      [ HP.class_ (ClassName "piece-component")
      , HP.draggable true 
      , HE.onWheel OnWheel
      , HE.onDragEnd (OnDrop state.location)
      ]
      (pieceTitle <> ports)
    where
      ports = enumFromTo Direction.Up Direction.Left <#> \dir ->
        HH.div [ HP.class_ (ClassName (show dir))]
          [ HH.img
            [ HP.src (portIconSrc dir)
            , HP.classes [ ClassName "port-icon" ]
            ]
          ]
      
      portIconSrc dir = case getPort state.piece dir of
        Just (Port.Input _) -> "./input-port.svg"
        Just (Port.Output _ )-> "./output-port.svg"
        Nothing -> "./no-port.svg"
      
      pieceTitle = [ HH.div [ HP.class_ (ClassName "piece-name") ] [ HH.div_ [ HH.text ( name state.piece) ] ] ]

  eval :: forall slots. H.HalogenQ Query Action Input ~> H.HalogenM State Action slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
        Initialise -> pure unit
        OnWheel event -> gets (_.location) >>= \loc -> H.raise (Rotated loc rot)
          where 
            rot = rotation $ round $ clamp (-1.0) 1.0 (WheelEvent.deltaY event)
        OnDrop loc event -> do
          log "PIECE: dropped piece, raised to board"
          H.raise (Dropped loc)
        OnDragLeave _ -> do
          log "piece left target"
    , handleQuery: case _ of
      _ -> pure Nothing
    , initialize: Just Initialise 
    , receive: const Nothing -- :: input -> Maybe action
    }