module Component.Level where

import Prelude

import AppM (AppM)
import Capability.Progress as Progress
import Component.Board as Board
import Component.Chat as Chat
import Component.GameEventLogger as GameEventLogger
import Component.Marginalia.Types (Marginalia, marginalia)
import Component.Marginalium as Marginalium
import Component.Sidebar as Sidebar
import Control.Alt ((<|>))
import Control.Monad.Cont (ContT(..), callCC, lift, runContT)
import Control.Monad.Except (ExceptT(..), runExceptT)
import Control.Monad.Logger.Class (class MonadLogger, debug, info)
import Control.Monad.State (evalState, modify_)
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
import Data.UUID.Random (UUIDv4)
import Data.UUID.Random as UUID
import Debug (spy)
import Effect.Aff (delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (Board(..), _size, firstEmptyLocation, getBoardPorts, standardBoard)
import Game.Direction (CardinalDirection)
import Game.GameEvent (GameEvent)
import Game.Level (LevelId, Level)
import Game.Level.Completion (CompletionStatus(..), FailedTestCase, isReadyForTesting, runSingleTest)
import Game.Piece (Piece(..), pieceLookup)
import Game.Port (Port(..))
import Game.Signal (Signal(..))
import GlobalState (GlobalState)
import Halogen (ClassName(..), Component, HalogenM, HalogenQ, Slot, gets, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

type Input = 
  { levelId :: LevelId
  , level :: Level
  }

type State =
  { levelId :: LevelId
  , level :: Level 
  , marginalia :: Map UUIDv4 Marginalia
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  }

--data Query a

data Action
  = Initialise
  | BoardOutput Board.Output
  | SidebarOutput Sidebar.Output
  | MarginaliumOutput Marginalium.Output

type Slots =
  ( board   :: Slot Board.Query Board.Output Unit
  --, chat    :: Slot Chat.Query Chat.Output Unit
  , sidebar :: Slot Sidebar.Query Sidebar.Output Unit
  , marginalia :: Slot Marginalium.Query Marginalium.Output UUIDv4
  , gameEventLogger :: forall q. Slot q Void Unit
  )

--_sidebar = Proxy :: Proxy "sidebar"
_board   = Proxy :: Proxy "board"
_chat    = Proxy :: Proxy "chat"
_sidebar = Proxy :: Proxy "sidebar"
_marginalia = Proxy :: _ "marginalia"
_gameEventLogger = Proxy :: Proxy "gameEventLogger"


component :: forall q o. Component q Input o AppM
component = H.mkComponent { eval , initialState , render }
  where
  Board initialBoard = standardBoard

  initialState { levelId, level } = 
    { levelId
    , level, completionStatus: NotStarted
    , boardSize: initialBoard.size
    , boardPorts: evalState getBoardPorts (Board initialBoard)
    , marginalia: M.empty
    }

  --render :: State -> HalogenM State Action Slots o m Unit
  render { level, levelId, marginalia, completionStatus, boardSize, boardPorts } = HH.div
    [ HP.id "puzzle-component"]
    [ HH.slot _board    unit Board.component { board: Board initialBoard} BoardOutput
    --, HH.slot_ _chat    unit Chat.component { conversation: level.conversation }
    , HH.slot _sidebar  unit Sidebar.component { problem: level.problem, completionStatus, boardSize, boardPorts } SidebarOutput
    , HH.div [ HP.id "marginalia" ] ((M.toUnfoldable marginalia :: Array _) <#> \(Tuple uuid m) -> HH.slot _marginalia uuid Marginalium.component { uuid, marginalia: m } MarginaliumOutput)
    , HH.slot_ _gameEventLogger unit GameEventLogger.component unit
    ]

  eval :: HalogenQ q Action Input ~> HalogenM State Action Slots o AppM
  eval = H.mkEval
    { finalize: Nothing
    , handleAction
    , handleQuery: case _ of
        _ -> pure Nothing
    , initialize: Just Initialise
    , receive: const Nothing -- :: input -> Maybe action
    }

  handleAction :: Action -> HalogenM State Action Slots o AppM Unit
  handleAction = case _ of
    Initialise -> do
      levelId <- gets (_.levelId)
      lift $ debug M.empty ("Initialised level " <> show levelId)

      -- initialise the chat server with conversation text
      -- initialConversation <- H.gets (_.level.conversation)

      --init marginalia
      gets (_.level.marginalia) >>= traverse_ \m -> do
        lift $ info M.empty "initialising marginalia"
        uuid <- UUID.make
        modify_ (\state -> state { marginalia = M.insert uuid m state.marginalia})


      -- make the board component display goal ports
      Piece piece <- H.gets (_.level.problem.goal)
      H.tell _board unit (Board.SetGoalPorts piece.ports)
    BoardOutput (Board.NewBoardState board) -> do
      -- the side bar updates the puzzle completion status, if the board is ready to be
      -- shown, trigger to test is on the sidebar
      problem <- H.gets (_.level.problem)
      modify_ $ _
        { completionStatus = isReadyForTesting problem board
        , boardSize = board ^. _size
        , boardPorts = evalState getBoardPorts board }
    SidebarOutput (Sidebar.PieceDropped pieceId) -> do
      maybeLocation <- H.request _board unit (Board.GetMouseOverLocation)
      for_ maybeLocation \loc -> 
        H.request _board unit (Board.AddPiece loc (pieceLookup pieceId))
    SidebarOutput (Sidebar.PieceAdded pieceId) -> do
      H.request _board unit Board.GetBoard >>= traverse_ \board -> do
        for_ (firstEmptyLocation board) \loc ->
          H.request _board unit (Board.AddPiece loc (pieceLookup pieceId))
    SidebarOutput Sidebar.BoardSizeIncremented ->
      H.tell _board unit Board.IncrementBoardSize
    SidebarOutput Sidebar.BoardSizeDecremented ->
      void $ H.request _board unit Board.DecrementBoardSize
    SidebarOutput Sidebar.TestsTriggered -> do
      let minTotalTestDurationMs = 2000
      problem <- gets (_.level.problem)
      let numTests = A.length problem.testCases
      let delayDuration =  Milliseconds (toNumber (minTotalTestDurationMs `div` numTests))

      testResult <- runExceptT $ forWithIndex problem.testCases \testIndex testCase  -> do
        modify_ $ _ { completionStatus = RunningTest { testIndex, numTests } }
        res <- ExceptT $ runSingleTest problem.goal testIndex testCase testEval
        liftAff (delay delayDuration)
        pure res

      case testResult of
        Left failedTestCase -> do
          modify_ $ _ { completionStatus = FailedTestCase failedTestCase }
        Right _  -> do
          levelId <-  gets (_.levelId)
          liftEffect $ Progress.saveLevelProgress levelId Progress.Completed
          modify_ $ _ { completionStatus = Completed }

    MarginaliumOutput (Marginalium.TriggerNext marginalia) -> do
      uuid <- UUID.make
      modify_ (\state -> state { marginalia = M.insert uuid marginalia state.marginalia})

    MarginaliumOutput (Marginalium.RemoveThis uuid) -> do
      modify_ \state -> state { marginalia = M.delete uuid state.marginalia }
      log "removed!" 



  testEval :: Map CardinalDirection Signal -> HalogenM State Action Slots o AppM (Map CardinalDirection Signal)
  testEval inputs = fromMaybe M.empty <$> H.request _board unit (Board.SetInputs inputs)