module Component.Puzzle where

import Prelude

import Component.Board as Board
import Component.Chat as Chat
import Component.Sidebar as Sidebar
import Data.Foldable (foldMap, for_)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Seconds(..))
import Data.Traversable (for)
import Debug (spy)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Game.Board (firstEmptyLocation)
import Game.ProblemDescription (ProblemDescription)
import Halogen (ClassName(..), HalogenM, HalogenQ, Slot)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

type Input =
  { problemDescription :: ProblemDescription
  , conversation :: Array (Chat.Message ( delayBy :: Seconds ))
  }

type State = Input

data Query a = GlobalKeyDown KeyboardEvent a

data Action = Initialise | BoardOutput Board.Output | SidebarOutput Sidebar.Output

data Output

type Slots =
  ( board   :: Slot Board.Query Board.Output Unit
  , chat    :: Slot Chat.Query Chat.Output Unit
  , sidebar :: Slot Sidebar.Query Sidebar.Output Unit )

--_sidebar = Proxy :: Proxy "sidebar"
_board   = Proxy :: Proxy "board"
_chat    = Proxy :: Proxy "chat"
_sidebar = Proxy :: Proxy "sidebar"


component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState = identity

  render state = HH.div [ HP.class_ (ClassName "puzzle")]
    [ HH.slot _board    unit Board.component Nothing BoardOutput
    , HH.slot_ _chat    unit Chat.component unit
    , HH.slot _sidebar  unit Sidebar.component state.problemDescription SidebarOutput
    ]

  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
      Initialise -> do
        initialConversation <- H.gets (_.conversation)
        H.tell _chat unit (\_ -> Chat.QueuedMessages initialConversation)
        maybeBoard <- H.request _board unit Board.GetBoard
        for_ maybeBoard $ \board ->
          H.request _sidebar unit (Sidebar.IsProblemSolved board)
      BoardOutput (Board.NewBoardState board) -> do
        H.tell _sidebar unit (\_ -> Sidebar.IsProblemSolved board (\_ -> unit))
      SidebarOutput (Sidebar.PieceDropped piece) -> do
        maybeLocation <- H.request _board unit (Board.GetMouseOverLocation)
        for_ maybeLocation \loc ->
          H.request _board unit (Board.AddPiece loc piece)
      SidebarOutput (Sidebar.PieceAdded piece) -> do
        maybeBoard <- H.request _board unit Board.GetBoard
        for_ maybeBoard \board ->
          for_ (firstEmptyLocation board) \loc ->
            H.request _board unit (Board.AddPiece loc piece)
    , handleQuery: case _ of
        GlobalKeyDown ke a -> do
          H.query _board unit (Board.GlobalKeyDown ke a)
    , initialize: Just Initialise
    , receive: const Nothing -- :: input -> Maybe action
    }
