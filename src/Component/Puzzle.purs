module Component.Puzzle where

import Prelude

import Capability.ChatServer (class ChatServer, sendMessage, setQueuedMessages)
import Capability.GlobalKeyDown (class GlobalKeyDown)
import Capability.Navigate (class Navigate)
import Component.Board as Board
import Component.Chat as Chat
import Component.Sidebar as Sidebar
import Data.Foldable (foldMap, for_)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Seconds(..))
import Data.Traversable (for)
import Debug (spy)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (firstEmptyLocation)
import Game.Board.BoardDeltaStore (BoardDeltaStore)
import Game.Message (Message)
import Game.Piece (name)
import Game.Piece.PieceLookup (pieceLookup)
import Game.ProblemDescription (ProblemDescription)
import Game.PuzzleSuite (Puzzle)
import Game.RulesEngine (Rule, runEngine)
import Halogen (ClassName(..), HalogenM, HalogenQ, Slot, gets)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import IO.Progress (PuzzleId, PuzzleProgress(..), puzzleProgress, savePuzzleProgress)
import Type.Proxy (Proxy(..))
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

type Input = 
  { puzzleId :: PuzzleId
  , puzzle :: Puzzle
  }

type State = Input

--data Query a

data Action = Initialise | BoardOutput Board.Output | SidebarOutput Sidebar.Output

type Slots =
  ( board   :: Slot Board.Query Board.Output Unit
  , chat    :: Slot Chat.Query Chat.Output Unit
  , sidebar :: Slot Sidebar.Query Sidebar.Output Unit )

--_sidebar = Proxy :: Proxy "sidebar"
_board   = Proxy :: Proxy "board"
_chat    = Proxy :: Proxy "chat"
_sidebar = Proxy :: Proxy "sidebar"


component :: forall q o m
  . MonadAff m
  => ChatServer m
  => Navigate m 
  => GlobalKeyDown m 
  => H.Component q Input o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState = identity

  render state = HH.div [ HP.class_ (ClassName "puzzle")]
    [ HH.slot _board    unit Board.component Nothing BoardOutput
    , HH.slot_ _chat    unit Chat.component unit
    , HH.slot _sidebar  unit Sidebar.component state.puzzle.problemDescription SidebarOutput
    ]

  eval :: HalogenQ q Action Input ~> HalogenM State Action Slots o m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
      Initialise -> do
        initialConversation <- H.gets (_.puzzle.conversation)
        setQueuedMessages initialConversation
        maybeBoard <- H.request _board unit Board.GetBoard
        for_ maybeBoard $ \board ->
          H.request _sidebar unit (Sidebar.IsProblemSolved board)
      BoardOutput (Board.NewBoardState boardDeltaStore board) -> do
        maybeMismatch <- H.request _sidebar unit (Sidebar.IsProblemSolved board)
        when (maybeMismatch == Nothing) do
          puzzleId <-  gets (_.puzzleId)
          liftEffect $ savePuzzleProgress puzzleId Completed
        gets (_.puzzle.boardDeltaRulesEngine) >>= \rulesEngine -> do
          for_ (runEngine rulesEngine boardDeltaStore) sendMessage
      SidebarOutput (Sidebar.PieceDropped pieceId) -> do
        maybeLocation <- H.request _board unit (Board.GetMouseOverLocation)
        for_ maybeLocation \loc ->
          H.request _board unit (Board.AddPiece loc pieceId)
      SidebarOutput (Sidebar.PieceAdded pieceId) -> do
        maybeBoard <- H.request _board unit Board.GetBoard
        for_ maybeBoard \board ->
          for_ (firstEmptyLocation board) \loc ->
            H.request _board unit (Board.AddPiece loc pieceId)
    , handleQuery: case _ of
        _ -> pure Nothing
    , initialize: Just Initialise
    , receive: const Nothing -- :: input -> Maybe action
    }
