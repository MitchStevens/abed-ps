module Game.Board.Edge.Class where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Maybe.Trans (MaybeT(..))
import Control.Monad.State (class MonadState)
import Data.Group (ginverse)
import Data.Lens (use)
import Data.Lens.At (at)
import Game.Board.Edge.AbsoluteEdge (AbsoluteEdge(..), BaseEdge, absolute, adjacentAbsoluteEdge)
import Game.Board.Edge.RelativeEdge (RelativeEdge(..), relative)
import Game.Board.Types (Board(..), _pieces)
import Game.Direction (CardinalDirection, rotateDirection)
import Game.Location (Location(..))
import Game.Piece (getPort)
import Game.Port (Port(..), portMatches)
import Prim.Coerce (class Coercible)
import Safe.Coerce (coerce)

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

edgeDirection :: forall e. Coercible e BaseEdge => Edge e => e -> CardinalDirection
edgeDirection = (coerce :: e -> BaseEdge) >>> _.dir

edgeLocation :: forall e. Coercible e BaseEdge => Edge e => e -> Location
edgeLocation = (coerce :: e -> BaseEdge) >>> _.loc

instance Edge AbsoluteEdge where
  toAbsoluteEdge = pure
  fromAbsoluteEdge = pure
  getPortOnEdge absEdge = do
    (relEdge :: RelativeEdge) <- fromAbsoluteEdge absEdge
    getPortOnEdge relEdge

instance Edge RelativeEdge where
  toAbsoluteEdge (Relative { loc, dir }) = do
    {piece, rotation} <- MaybeT $ use (_pieces <<< at loc)
    pure $ absolute loc (rotateDirection dir rotation)
  fromAbsoluteEdge (Absolute { loc, dir }) = do
    {piece, rotation} <- MaybeT $ use (_pieces <<< at loc)
    pure $ relative loc (rotateDirection dir (ginverse rotation))
  getPortOnEdge (Relative { loc, dir }) = do
    { piece, rotation } <- MaybeT $ use (_pieces <<< at loc)
    MaybeT $ pure $ getPort piece dir