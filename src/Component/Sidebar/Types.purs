module Component.Sidebar.Types where

import Prelude

import Data.Map (Map)
import Game.Direction (CardinalDirection)
import Game.Level.Completion (CompletionStatus)
import Game.Level.Problem (Problem)
import Game.Piece (PieceId(..))
import Game.Port (Port(..))
import Game.Signal (Base, SignalRepresentation)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = 
  { problem :: Problem
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  , base :: Base
  }

type State =
  { problem :: Problem
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  , base :: Base
  }

data Query a

data Button
  = AddPiece PieceId
  | BackToLevelSelect 
  | IncrementBoardSize
  | DecrementBoardSize
  | Undo
  | Redo
  | RunTests
  | Clear
  | Base Base

data Action
  = Initialise Input
  | PieceOnDrop PieceId DragEvent
  | ButtonClicked Button MouseEvent
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
