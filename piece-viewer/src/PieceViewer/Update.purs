module PieceViewer.Update
  ( Update(..)
  , applyUpdate
  ) where

import Prelude

import Data.Array as A
import Data.Enum (fromEnum)
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Game.Direction (CardinalDirection)
import Game.Piece (PieceId(..), adapt, allPieces, getPort, pieceLookup)
import Game.Port (PortType, isInput)
import Game.Rotation (rotation)
import PieceViewer.Types as Types

data Update
  = SelectPiece PieceId
  | SetScale Number
  | RotateCW
  | RotateCCW
  | SetTiled Boolean
  | SetAdaptDirection CardinalDirection
  | SetAdaptPortType (Maybe PortType)
  | ApplyAdapt
  | SetInputValue CardinalDirection Int
  | AnimateHeadShake
  | AnimateSpin
  | AnimatePieceAdded
  | AnimatePieceRemoved

applyUpdate :: Update -> Types.State -> Types.State
applyUpdate = case _ of
  SelectPiece pieceId ->
    \st -> st { piece = pieceLookup pieceId, inputValues = Map.empty }
  SetScale n ->
    \st -> if st.tiled then st else st { scale = clamp 0.25 2.5 n }
  RotateCW ->
    \st -> st { rotation = rotation (fromEnum st.rotation + 1) }
  RotateCCW ->
    \st -> st { rotation = rotation (fromEnum st.rotation - 1) }
  SetTiled tiled ->
    \st -> st { tiled = tiled }
  SetAdaptDirection dir ->
    \st -> st { adaptDirection = dir }
  SetAdaptPortType portType ->
    \st -> st { adaptPortType = portType }
  ApplyAdapt ->
    \st ->
      st { piece = adapt st.adaptDirection st.adaptPortType st.piece
         , inputValues = Map.empty
         }
  SetInputValue dir value ->
    \st ->
      if maybe false isInput (getPort st.piece dir) then
        st { inputValues = Map.insert dir value st.inputValues }
      else
        st
  AnimateHeadShake ->
    \st -> st { animation = Just Types.HeadShake }
  AnimateSpin ->
    \st -> st { animation = Just Types.Spin }
  AnimatePieceAdded ->
    \st -> st { animation = Just Types.PieceAdded }
  AnimatePieceRemoved ->
    \st -> st { animation = Just Types.PieceRemoved }