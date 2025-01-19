module Component.Sidebar.Types where

import Prelude

import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Component.TestRunner as TestRunner
import Data.Lens (Lens')
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Maybe (Maybe)
import Game.Direction (CardinalDirection)
import Game.Level (Level)
import Game.Level.Completion (CompletionStatus)
import Game.Piece (PieceId(..))
import Game.Port (Port(..))
import Game.Signal (Base, SignalRepresentation)
import Game.TestCase (TestCase, TestCaseData, TestCaseOutcome)
import Halogen (Slot)
import Type.Proxy (Proxy(..))
import Web.Event.Internal.Types (Event)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = 
  { level :: Level
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  }

type State =
  { level :: Level
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  }

data Query a
  = AmendBoardSizeSlider Int a
  | TestCaseResponse TestCaseOutcome a

data Button
  = AddPiece PieceId
  | BackToLevelSelect 
  | Undo
  | Redo
  | RunTests
  | Clear
  | Base Base
  | RunDemonstration
derive instance Eq Button

data InputField
  = BoardSize Int -- needs to be maybe

data Action
  = Receive Input
  | PieceOnDrop PieceId DragEvent
  | ButtonClicked Button MouseEvent
  | BoardSizeSliderAction BoardSizeSlider.Output
  | TestRunnerAction TestRunner.Output
  {-
    the sidebar creates little icons using the same piece rendering as pieces. the type of HTML used in piece rendering is:
      `ComponentHTML Piece.Action s m`
    
    When the sidebar renders the little icons, it requires HTML of type
      `ComponentHTML Sidebar.Action s m`
    
    We use the function `mapActionOverHTML :: (a -> a') -> ComponentHTML a s m -> ComponentHTML a' s m` to convert between the two HTML types, but this requires a mapping between between piece actions and sidebar actions. The simplest such function is:
      (\_ -> DoNothing) :: Piece.Action -> Sidebar.Action)
  -}
  | DoNothing

data Output
  = PieceDropped PieceId
  | ButtonOutput Button
  | InputFieldOutput InputField
  | TestRunnerOutput TestRunner.Output

type Slots =
  ( testRunner :: Slot TestRunner.Query TestRunner.Output Unit
  , boardSizeSlider :: Slot BoardSizeSlider.Query BoardSizeSlider.Output Unit
  )

initialState :: Input -> State
initialState = identity

slot = Proxy :: Proxy "sidebar"

_completionStatus :: Lens' State CompletionStatus
_completionStatus = prop (Proxy :: Proxy "completionStatus")
