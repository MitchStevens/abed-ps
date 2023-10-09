module Game.BoardDelta where

import Prelude

import Data.Either (Either)
import Data.Group (ginverse)
import Data.List (List(..))
import Data.List as L
import Data.Maybe (Maybe(..))
import Game.Board (Board(..), BoardError, BoardM, addPiece, getPieceInfo, removePiece, rotatePieceBy)
import Game.Location (Location(..), Rotation(..))
import Game.Piece (APiece(..))

data BoardDelta
  = AddedPiece Location APiece
  | RemovedPiece Location APiece
  | MovedPiece Location Location
  | RotatedPiece Location Rotation
derive instance Eq BoardDelta

invertBoardDelta :: BoardDelta -> BoardDelta
invertBoardDelta = case _ of
  AddedPiece loc piece -> RemovedPiece loc piece
  RemovedPiece loc piece -> AddedPiece loc piece
  MovedPiece from to -> MovedPiece to from
  RotatedPiece loc rot -> RotatedPiece loc (ginverse rot)

runDelta :: BoardDelta -> BoardM Unit
runDelta = case _ of
  AddedPiece loc piece -> addPiece loc piece
  RemovedPiece loc _ -> void $ removePiece loc
  MovedPiece src dst -> do
    p <- getPieceInfo src
    _ <- removePiece src
    addPiece dst p.piece
  RotatedPiece loc rot -> rotatePieceBy loc rot
  
undoDelta :: BoardDelta -> BoardM Unit
undoDelta delta = runDelta (invertBoardDelta delta)

cons :: BoardDelta -> List BoardDelta -> List BoardDelta
cons delta list = case L.uncons list of
  Just { head, tail } ->
    if head == invertBoardDelta delta 
      then tail
      else Cons delta list
  Nothing -> Nil