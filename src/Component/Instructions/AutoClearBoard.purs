module Component.Instructions.AutoClearBoard where

import Prelude

import AppM (AppM)
import Component.Board as Board
import Data.Foldable (traverse_)
import Data.Time.Duration (Milliseconds(..))
import Effect.Aff (forkAff)
import Effect.Aff as Aff
import Game.Board (standardBoard)
import Game.GameEvent (BoardEvent(..))
import Game.Location (Location)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, Slot)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Subscription as HS
import Type.Proxy (Proxy(..))

-- | A 3x3 sandbox board where nothing sticks around: any piece placed on
-- | it -- clicked, dragged, or drawn as a wire -- is removed again
-- | `clearAfter` later. No instructional copy here on purpose; this is
-- | just the interactive slot.
type State = Unit

data Action
  = BoardOutput Board.Output
  | RemoveAfterDelay Location

data Query a

type Output = Void

type Slots = ( board :: Slot Board.Query Board.Output Unit )

slot = Proxy :: Proxy "autoClearBoard"

clearAfter :: Milliseconds
clearAfter = Milliseconds 2000.0

component :: Component Query Unit Output AppM
component = H.mkComponent { eval, initialState, render }
  where
  initialState _ = unit

  render :: State -> ComponentHTML Action Slots AppM
  render _ =
    HH.div
      [ HP.class_ (ClassName "auto-clear-board") ]
      [ HH.slot Board.slot unit Board.component { board: standardBoard } BoardOutput ]

  eval = H.mkEval H.defaultEval { handleAction = handleAction }

  handleAction :: Action -> HalogenM State Action Slots Output AppM Unit
  handleAction = case _ of
    BoardOutput (Board.BoardEvent event) -> case event of
      AddPieceEvent loc _ -> scheduleRemoval loc
      AddPathEvent _ locations _ -> traverse_ scheduleRemoval locations
      _ -> pure unit
    BoardOutput (Board.NewBoardState _) -> pure unit

    RemoveAfterDelay loc -> do
      _ <- H.request Board.slot unit (Board.RemovePiece loc)
      pure unit

  -- One independent one-shot timer per placement, so pieces placed a beat
  -- apart each get their own 2-second countdown rather than sharing one.
  scheduleRemoval :: Location -> HalogenM State Action Slots Output AppM Unit
  scheduleRemoval loc = do
    { emitter, listener } <- H.liftEffect HS.create
    _ <- H.liftAff $ forkAff do
      Aff.delay clearAfter
      H.liftEffect $ HS.notify listener loc
    _ <- H.subscribe (RemoveAfterDelay <$> emitter)
    pure unit
