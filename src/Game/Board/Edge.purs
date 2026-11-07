module Game.Board.Edge (module Game.Board.Edge, module Game.Board.Edge.Base) where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Maybe.Trans (MaybeT(..))
import Control.Monad.State (class MonadState)
import Data.Either (Either(..))
import Data.Group (ginverse)
import Data.Lens (use, view)
import Data.Lens.At (at)
import Data.Maybe (Maybe(..))
import Game.Board.Edge.Base
import Game.Board.Types (Board, Cell(..), _pieces, _ports)
import Game.Frame as Frame
import Game.Direction (rotateDirection)
import Game.Piece (getPort)
import Game.Port (Port, hasPort, portMatches)

{-
  toAbsoluteEdge >=> 

-}
class Edge e where
  toAbsoluteEdge   :: forall m. MonadState Board m => e -> MaybeT m AbsoluteEdge
  fromAbsoluteEdge :: forall m. MonadState Board m => AbsoluteEdge -> MaybeT m e
  getPortOnEdge    :: forall m. MonadState Board m => e -> MaybeT m Port

adjacent :: forall m e f. Edge e => Edge f => MonadState Board m => e -> MaybeT m f
adjacent = toAbsoluteEdge >=> (adjacentAbsoluteEdge >>> fromAbsoluteEdge)

-- TODO: conversion to reledge seems like a lot of work? what if e = RelEdge already?
connected :: forall m e f. Edge e => Edge f => MonadState Board m => e -> MaybeT m f
connected edge = do
  adj <- adjacent edge
  (portMatches <$> getPortOnEdge edge <*> getPortOnEdge adj) >>= guard
  pure adj

instance Edge AbsoluteEdge where
  toAbsoluteEdge = pure
  fromAbsoluteEdge = pure
  getPortOnEdge absEdge = do
    (relEdge :: RelativeEdge) <- fromAbsoluteEdge absEdge
    getPortOnEdge relEdge

instance Edge RelativeEdge where
  toAbsoluteEdge (Relative { loc, dir }) = do
    { rotation } <- MaybeT $ use (_pieces <<< at loc)
    pure $ absolute loc (rotateDirection dir rotation)
  fromAbsoluteEdge (Absolute { loc, dir }) = do
    { rotation } <- MaybeT $ use (_pieces <<< at loc)
    pure $ relative loc (rotateDirection dir (ginverse rotation))
  getPortOnEdge (Relative { loc, dir }) = do
    { piece } <- MaybeT $ use (_pieces <<< at loc)
    MaybeT $ pure case piece of
      Leaf p -> getPort p dir
      -- a sub-board's ports are its sides
      Nested board ->
        let port = Frame.index dir (view _ports board)
        in if hasPort port then Just port else Nothing
