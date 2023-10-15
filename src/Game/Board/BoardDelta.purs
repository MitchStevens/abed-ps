module Game.Board.BoardDelta where

import Prelude

import Data.Either (Either)
import Data.Foldable (traverse_)
import Data.Group (ginverse)
import Data.List (List(..))
import Data.List as L
import Data.Maybe (Maybe(..))
import Data.Predicate (Predicate(..))
import Game.Board (Board(..), BoardError, BoardM, BoardT, addPiece, getPieceInfo, removePiece, rotatePieceBy)
import Game.Location (Location(..), Rotation(..))
import Game.Piece (APiece(..), PieceId(..))
import Game.Piece.PieceLookup (pieceLookup)

data BoardDelta
  = AddedPiece Location PieceId
  | RemovedPiece Location PieceId
  | MovedPiece Location Location
  | RotatedPiece Location Rotation
derive instance Eq BoardDelta
derive instance Ord BoardDelta

instance Show BoardDelta where
  show = case _ of
    AddedPiece loc pieceId -> "Added " <> show loc <> " at " <> show pieceId
    RemovedPiece loc pieceId -> "Removed " <> show loc <> " at " <> show pieceId
    MovedPiece src dst -> "Moved piece from " <> show src <> " to " <> show dst
    RotatedPiece loc rot -> "Rotated by " <> show rot <> " at " <> show loc

invertBoardDelta :: BoardDelta -> BoardDelta
invertBoardDelta = case _ of
  AddedPiece loc pieceId -> RemovedPiece loc pieceId
  RemovedPiece loc pieceId -> AddedPiece loc pieceId
  MovedPiece from to -> MovedPiece to from
  RotatedPiece loc rot -> RotatedPiece loc (ginverse rot)

runDelta :: forall m. Monad m => BoardDelta -> BoardT m Unit
runDelta = case _ of
  AddedPiece loc pieceId -> traverse_  (addPiece loc) (pieceLookup pieceId)
  RemovedPiece loc _ -> void $ removePiece loc
  MovedPiece src dst -> do
    p <- getPieceInfo src
    _ <- removePiece src
    addPiece dst p.piece
  RotatedPiece loc rot -> rotatePieceBy loc rot
  
undoDelta :: forall m. Monad m => BoardDelta -> BoardT m Unit
undoDelta delta = runDelta (invertBoardDelta delta)

--cons :: BoardDelta -> List BoardDelta -> List BoardDelta
--cons delta list = case L.uncons list of
--  Just { head, tail } ->
--    if head == invertBoardDelta delta 
--      then tail
--      else Cons delta list
--  Nothing -> Nil
