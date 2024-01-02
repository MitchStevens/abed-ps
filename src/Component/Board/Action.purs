module Component.Board.Action where

import Component.Board.Types
import Prelude

import Control.Monad.Error.Class (class MonadError)
import Control.Monad.State (class MonadState, gets, modify_)
import Data.Either (Either)
import Data.Foldable (traverse_)
import Data.FoldableWithIndex (forWithIndex_, traverseWithIndex_)
import Data.Lens (use)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Data.Zipper as Z
import Effect.Class (class MonadEffect)
import Game.Board (Board(..))
import Game.Board.Operation (BoardError, BoardT, BoardM, movePiece, removePiece, runBoardM, runBoardT)
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection, allDirections)
import Game.Location (Location(..))
import Game.Piece (Piece(..), PieceId(..), isInput, isOutput)
import Game.Signal (Signal(..))
import Halogen (HalogenM)
import Halogen.Svg.Attributes (m)

liftBoardM :: forall m a. BoardM a -> HalogenM State Action Slots Output m (Either BoardError (Tuple a Board))
liftBoardM boardT = runBoardM boardT <$> use _board

pieceDropped :: forall m. MonadState Board m => MonadError BoardError m
  => Location -> Maybe Location -> m Piece
pieceDropped src maybeDst =
  -- when a piece is dropped, it can be dropped over a new location or outside the game board 
  case maybeDst of
    -- if the piece is dropped over a new location, attempt to add the piece to the board
    Just dst -> movePiece src dst 
    -- if the piece is dropped somewhere that is not a location, remove it from the board
    Nothing -> removePiece src

getBoardPorts :: forall m. MonadState State m => m (Map CardinalDirection PortInfo)
getBoardPorts =
  M.catMaybes $ M.fromFoldable $ for allDirections \dir -> (Tuple dir <$> use (_boardPort dir))

getInputs :: forall m. MonadState State m => m (Map CardinalDirection Signal)
getInputs = M.mapMaybe (\{port, connection, signal} -> if isInput port then Just signal else Nothing) <$> getBoardPorts

setInputs :: forall m. MonadState State m => Map CardinalDirection Signals -> m Unit
setInputs = traverseWithIndex_ \dir signal -> do
  

getOutputs :: forall m. MonadState State m => m (Map CardinalDirection Signal)
getOutputs = M.mapMaybe (\{port, connection, signal} -> if isOutput port then Just signal else Nothing) <$> getBoardPorts