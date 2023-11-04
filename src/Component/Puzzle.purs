module Component.Puzzle where

import Prelude

import Capability.ChatServer (putQueuedMessages, sendMessage)
import Capability.Progress (PuzzleProgress(..), savePuzzleProgress)
import Component.Board as Board
import Component.Chat as Chat
import Component.Sidebar as Sidebar
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Data.Foldable (foldMap, for_, traverse_)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Seconds(..))
import Data.Traversable (for)
import Debug (spy)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (firstEmptyLocation)
import Game.GameEvent (GameEvent, GameEventStore)
import Game.Message (Message)
import Game.Piece (name, ports)
import Game.Piece.PieceLookup (pieceLookup)
import Game.ProblemDescription (ProblemDescription)
import Game.Puzzle (Puzzle, PuzzleId)
import Game.RulesEngine (Rule, runEngine)
import GlobalState (GlobalState)
import Halogen (ClassName(..), Component, HalogenM, HalogenQ, Slot, gets)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Store.Monad (class MonadStore)
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
  => MonadAsk GlobalState m
  => MonadStore GameEvent GameEventStore m
  => Component q Input o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState = identity

  --render :: State -> HalogenM State Action Slots o m Unit
  render { puzzle, puzzleId } = HH.div [ HP.class_ (ClassName "puzzle")]
    [ HH.slot _board    unit Board.component Nothing BoardOutput
    , HH.slot_ _chat    unit Chat.component unit
    , HH.slot _sidebar  unit Sidebar.component { problem: puzzle.problemDescription } SidebarOutput
    ]

  eval :: HalogenQ q Action Input ~> HalogenM State Action Slots o m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
      Initialise -> do
        initialConversation <- H.gets (_.puzzle.conversation)
        putQueuedMessages initialConversation
        maybeBoard <- H.request _board unit Board.GetBoard
        for_ maybeBoard $ \board ->
          H.request _sidebar unit (Sidebar.IsProblemSolved board)

        piece <- H.gets (_.puzzle.problemDescription.goal)
        H.tell _board unit (\_ -> Board.SetGoalPorts (ports piece))
      BoardOutput (Board.NewBoardState board) -> do
        -- the sidebar should be updated with the new board so it can display the
        -- pieceSpecMismatch 
        maybeMismatch <- H.request _sidebar unit (Sidebar.IsProblemSolved board)

        -- when puzzle is complete, save the puzzle
        when (maybeMismatch == Nothing) do
          puzzleId <-  gets (_.puzzleId)
          liftEffect $ savePuzzleProgress puzzleId Completed
      SidebarOutput (Sidebar.PieceDropped pieceId) -> do
        maybeLocation <- H.request _board unit (Board.GetMouseOverLocation)
        for_ maybeLocation (addPieceToComponent pieceId)
      SidebarOutput (Sidebar.PieceAdded pieceId) -> do
        H.request _board unit Board.GetBoard >>= traverse_ \board ->
          for_ (firstEmptyLocation board) (addPieceToComponent pieceId)
      SidebarOutput Sidebar.BoardSizeIncremented ->
        void $ H.request _board unit Board.IncrementBoardSize
      SidebarOutput Sidebar.BoardSizeDecremented ->
        void $ H.request _board unit Board.DecrementBoardSize
    , handleQuery: case _ of
        _ -> pure Nothing
    , initialize: Just Initialise
    , receive: const Nothing -- :: input -> Maybe action
    }
  
  addPieceToComponent pieceId loc = do
    for_ (pieceLookup pieceId) \piece ->
      H.tell _board unit (\_ -> Board.AddPiece loc piece)
