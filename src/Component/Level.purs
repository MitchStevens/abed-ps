module Component.Level where

import Prelude

import Capability.ChatServer (putQueuedMessages, sendMessage)
import Capability.Progress as Progress
import Component.Board as Board
import Component.Chat as Chat
import Component.Sidebar as Sidebar
import Control.Alt ((<|>))
import Control.Monad.Cont (ContT(..), callCC, lift, runContT)
import Control.Monad.Except (ExceptT(..), runExceptT)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Data.Array (intercalate, intersperse)
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), either, isRight)
import Data.Foldable (foldMap, for_, length, traverse_)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Int (toNumber)
import Data.Lens ((^.))
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Time.Duration (Milliseconds(..), Seconds(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..), fst, snd)
import Debug (spy)
import Effect.Aff (delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (_size, firstEmptyLocation)
import Game.Expression (Signal(..))
import Game.GameEvent (GameEvent, GameEventStore)
import Game.Direction (CardinalDirection)
import Game.Message (Message(..), green, htmlMessage, message, red)
import Game.Piece (APiece, pieceLookup)
import GlobalState (GlobalState)
import Halogen (ClassName(..), Component, HalogenM, HalogenQ, Slot, gets)
import Halogen as H
import Halogen.HTML (PlainHTML)
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

data Action
  = Initialise
  | LevelComplete
  | BoardOutput Board.Output
  | SidebarOutput Sidebar.Output

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
  render { puzzle, puzzleId } = HH.div
    [ HP.id "puzzle-component"]
    [ HH.slot _board    unit Board.component Nothing BoardOutput
    , HH.slot_ _chat    unit Chat.component unit
    , HH.slot _sidebar  unit Sidebar.component { problem: puzzle.problem, boardSize: 3 } SidebarOutput
    ]

  eval :: HalogenQ q Action Input ~> HalogenM State Action Slots o m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction
    , handleQuery: case _ of
        _ -> pure Nothing
    , initialize: Just Initialise
    , receive: const Nothing -- :: input -> Maybe action
    }

  handleAction :: Action -> HalogenM State Action Slots o m Unit
  handleAction = case _ of
    Initialise -> do
      -- initialise the chat server with conversation text
      initialConversation <- H.gets (_.puzzle.conversation)
      putQueuedMessages initialConversation

      -- make the board component display goal ports
      piece <- H.gets (_.puzzle.problem.goal)
      H.tell _board unit (\_ -> Board.SetGoalPorts (getPorts piece))
    LevelComplete -> do
      log "level complete"
      H.tell _sidebar unit (\_ -> Sidebar.SetCompletionStatus Completed)

      puzzleId <-  gets (_.puzzleId)
      liftEffect $ Progress.savePuzzleProgress puzzleId Progress.Completed
    BoardOutput (Board.NewBoardState board) -> do
      -- the sidebar is also update with the current size of the board
      H.tell _sidebar unit (\_ -> Sidebar.SetBoardSize (board ^. _size))

      -- the side bar updates the puzzle completion status, if the board is ready to be
      -- shown, trigger to test is on the sidebar
      problem <- H.gets (_.puzzle.problem)
      let status = isReadyForTesting problem board

      H.tell _sidebar unit (\_ -> Sidebar.SetCompletionStatus status)
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
    SidebarOutput Sidebar.TestsTriggered -> do
      sendMessage (htmlMessage "/test" (HH.b_ [HH.text "Verifying board: running tests..."]))

      let eval inputs = fromMaybe M.empty <$> H.request _board unit (Board.SetInputs inputs)
      problem <- gets (_.puzzle.problem)

      res <- runAllTests problem.goal (L.fromFoldable problem.testCases) eval

      when (isRight res) do
        sendMessage (htmlMessage "/test" (HH.b_ [HH.text "Tests completed successfully!"]))
        handleAction LevelComplete

  addPieceToComponent pieceId loc =
      H.tell _board unit (\_ -> Board.AddPiece loc (pieceLookup pieceId))


-- this should be CPS but it's fine for small number of inputs
runAllTests :: forall m. MonadAff m => MonadAsk GlobalState m
  => APiece -> List (Map CardinalDirection Signal) -> (Map CardinalDirection Signal -> m (Map CardinalDirection Signal)) -> m (Either FailedTestCase Unit)
runAllTests piece inputs testEval = runTestsAcc 1 inputs
  where
    totalTestDurationMs = 2000
    delayDuration =  Milliseconds (toNumber (totalTestDurationMs `div` length inputs))
    n = length inputs

    runTestsAcc i = case _ of
      Nil -> pure (Right unit)
      --Cons input Nil -> runSingleTest piece input testEval
      Cons input rest -> do
        log (show input)
        result <- runSingleTest piece input testEval
        liftAff (delay delayDuration)
        case result of
          Left err -> do
            sendMessage (htmlMessage "/test" (renderTestError err i n))
            pure $ Left err
          Right _ -> do
            sendMessage (htmlMessage "/test" (renderTestSuccess i n))
            runTestsAcc (i+1) rest



renderTestSuccess :: Int -> Int -> PlainHTML
renderTestSuccess i n = HH.span_ [ green (show i <> "/" <> show n), HH.text " Sucessful" ]

renderTestError :: FailedTestCase -> Int -> Int -> PlainHTML
renderTestError { inputs, expected, recieved } i n = HH.div_
  [ HH.div_ [ red (show i <> "/" <> show n) , HH.text " Failed:" ]
  , HH.div_ [HH.text "  - inputs: ", printPorts inputs]
  , HH.div_ [HH.text "  - expected outputs: ", printPorts expected]
  , HH.div_ [HH.text "  - recieved outputs: ", printReceivedOutputs ]
  ]

  where
    showTuple (Tuple dir signal) = show dir <> ": " <> show signal

    printPorts m = HH.text $
      intercalate ", " $ map showTuple (M.toUnfoldable m :: Array _)

    printReceivedOutputs = HH.span_ $
      intersperse (HH.text ", ") $ (M.toUnfoldable recieved :: Array _) <#> \tuple ->
        if M.lookup (fst tuple) expected == Just (snd tuple)
          then green (showTuple tuple)
          else red (showTuple tuple)