module Component.Board.Action where

import Component.Board.Types
import Data.Lens
import Prelude

import Control.Monad.Error.Class (class MonadError)
import Control.Monad.State (class MonadState, gets, modify_)
import Data.Either (Either)
import Data.Foldable (traverse_)
import Data.FoldableWithIndex (forWithIndex_, traverseWithIndex_)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.TraversableWithIndex (forWithIndex)
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
getBoardPorts = M.catMaybes <$> 
  forWithIndex (S.toMap (S.fromFoldable allDirections)) \dir _ -> use (_boardPort dir)

getInputs :: forall m. MonadState State m => m (Map CardinalDirection Signal)
getInputs = M.mapMaybe (\{port, connected, signal} -> if isInput port then Just signal else Nothing) <$> getBoardPorts

setInputs :: forall m. MonadState State m => Map CardinalDirection Signal -> m Unit
setInputs = traverseWithIndex_ \dir signal -> _boardPort dir <<< _Just %= _ { signal = signal }
  
getOutputs :: forall m. MonadState State m => m (Map CardinalDirection Signal)
getOutputs = M.mapMaybe (\{port, connected, signal} -> if isOutput port then Just signal else Nothing) <$> getBoardPorts