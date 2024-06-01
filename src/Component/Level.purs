module Component.Level where

import Prelude

import Capability.LocalStorage.LevelProgress as LevelProgress
import Component.Board as Board
import Component.Chat as Chat
import Component.Sidebar as Sidebar
import Control.Alt ((<|>))
import Control.Monad.Cont (ContT(..), callCC, lift, runContT)
import Control.Monad.Except (ExceptT(..), runExceptT)
import Control.Monad.Logger.Class (class MonadLogger, debug, info)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (evalState)
import Data.Array (intercalate, intersperse)
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), either, isRight)
import Data.Foldable (fold, foldMap, for_, length, traverse_)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Int (toNumber)
import Data.Lens ((^.))
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Time.Duration (Milliseconds(..), Seconds(..))
import Data.Traversable (for, traverse)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..), fst, snd)
import Debug (spy)
import Effect.Aff (delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (Board(..), _size, firstEmptyLocation, getBoardPorts, standardBoard)
import Game.Piece.Direction (CardinalDirection)
import Game.GameEvent (GameEvent, GameEventStore)
import Game.Level (Level(..), unlocksUponCompletion)
import Game.Level.Completion (CompletionStatus(..), FailedTestCase, isReadyForTesting, runSingleTest)
import Game.Level.Suite (LevelId(..))
import Game.Piece (Piece(..), pieceLookup)
import Game.Piece.Port (Port(..))
import Game.Piece.Signal (Signal(..))
import GlobalState (GlobalState)
import GlobalState as GlobalState
import Halogen (ClassName(..), Component, HalogenM, HalogenQ, Slot, ComponentHTML, gets, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

type Input = 
  { level :: Level
  , levelId :: LevelId
  }

type State =
  { level :: Level 
  , levelId :: LevelId
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  }

--data Query a

data Action
  = Initialise
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
  => MonadLogger m
  => Component q Input o m
component = H.mkComponent { eval , initialState , render }
  where
  Board initialBoard = standardBoard

  initialState { level, levelId } = { level, levelId, completionStatus: NotStarted, boardSize: initialBoard.size, boardPorts: evalState getBoardPorts (Board initialBoard) }

  render :: State -> ComponentHTML Action Slots m
  render { level: Level l, completionStatus, boardSize, boardPorts } = HH.div
    [ HP.id "puzzle-component"]
    [ HH.slot _board    unit Board.component { board: Board initialBoard } BoardOutput
    , HH.slot_ _chat    unit Chat.component { conversation: l.conversation }
    , HH.slot _sidebar  unit Sidebar.component { level: Level l, completionStatus, boardSize, boardPorts } SidebarOutput
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
      Level level <- gets (_.level)
      lift $ debug M.empty ("initialised level " <> show level.name)


      -- make the board component display goal ports
      let Piece piece = level.goal 
      H.tell _board unit (\_ -> Board.SetGoalPorts piece.ports)
    BoardOutput (Board.NewBoardState board) -> do
      -- the side bar updates the puzzle completion status, if the board is ready to be
      -- shown, trigger to test is on the sidebar
      level <- H.gets (_.level)
      modify_ $ _
        { completionStatus = isReadyForTesting level board
        , boardSize = board ^. _size
        , boardPorts = evalState getBoardPorts board }
    SidebarOutput (Sidebar.PieceDropped pieceId) -> do
      maybeLocation <- H.request _board unit (Board.GetMouseOverLocation)
      for_ maybeLocation \loc -> 
        H.tell _board unit (\_ -> Board.AddPiece loc (pieceLookup pieceId))
    SidebarOutput (Sidebar.PieceAdded pieceId) -> do
      H.request _board unit Board.GetBoard >>= traverse_ \board -> do
        log (show (firstEmptyLocation board) )
        for_ (firstEmptyLocation board) \loc ->
          H.tell _board unit (\_ -> Board.AddPiece loc (pieceLookup pieceId))
    SidebarOutput Sidebar.BoardSizeIncremented ->
      void $ H.request _board unit Board.IncrementBoardSize
    SidebarOutput Sidebar.BoardSizeDecremented ->
      void $ H.request _board unit Board.DecrementBoardSize
    SidebarOutput Sidebar.TestsTriggered -> do
      let minTotalTestDurationMs = 2000
      Level level <- gets (_.level)
      let numTests = A.length level.testCases
      let delayDuration =  Milliseconds (toNumber (minTotalTestDurationMs `div` numTests))

      testResult <- runExceptT $ forWithIndex level.testCases \testIndex testCase  -> do
        modify_ $ _ { completionStatus = RunningTest { testIndex, numTests } }
        res <- ExceptT $ runSingleTest level.goal testIndex testCase testEval
        liftAff (delay delayDuration)
        pure res

      case testResult of
        Left failedTestCase -> do
          modify_ $ _ { completionStatus = FailedTestCase failedTestCase }
        Right _  -> do
          modify_ $ _ { completionStatus = Completed }

          levelId <-  gets (_.levelId)
          GlobalState.setLevelProgress levelId LevelProgress.Completed

          gets (_.level >>> unlocksUponCompletion) >>= traverse_ \(Level l) ->
            GlobalState.lookupLevelId l.name >>= traverse_ (\id -> GlobalState.setLevelProgress id LevelProgress.Unlocked)
      where
        testEval :: Map CardinalDirection Signal -> HalogenM State Action Slots o m (Map CardinalDirection Signal)
        testEval inputs = fromMaybe M.empty <$> H.request _board unit (Board.SetInputs inputs)

-- this should be CPS but it's fine for small number of inputs
--runAllTests :: forall m. MonadAff m => MonadAsk GlobalState m
--  => Piece -> List (Map CardinalDirection Signal) -> (Map CardinalDirection Signal -> m (Map CardinalDirection Signal)) -> m (Either FailedTestCase Unit)
--runAllTests piece inputs testEval = runTestsAcc 1 inputs
--  where
--    totalTestDurationMs = 2000
--    n = length inputs
--
--    runTestsAcc i = case _ of
--      Nil -> pure (Right unit)
--      --Cons input Nil -> runSingleTest piece input testEval
--      Cons input rest -> do
--        log (show input)
--        result <- runSingleTest piece input testEval
--        liftAff (delay delayDuration)
--        case result of
--          Left err -> do
--            sendMessage (htmlMessage "/test" (renderTestError err i n))
--            pure $ Left err
--          Right _ -> do
--            sendMessage (htmlMessage "/test" (renderTestSuccess i n))
--            runTestsAcc (i+1) rest


