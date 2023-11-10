module Game.Board.Path where

import Prelude

import Control.Monad.State (class MonadState)
import Data.Foldable (null)
import Data.List (List(..))
import Data.Maybe (Maybe(..))
import Data.PQueue as PQ
import Data.Set as S
import Data.Tuple (Tuple(..), snd)
import Data.Unfoldable (unfoldr)
import Data.Zipper (Zipper(..))
import Game.Board (Board(..), buildBoardGraph)
import Game.GameEvent (BoardEvent)
import Game.Location (Location(..), directionTo)

-- board path builds along all the locations
boardPath :: forall m. MonadState Board m => Array Location -> m (Maybe (List BoardEvent))
boardPath path = do
  pure Nothing
--
--singleBoardPath :: Direction -> Location -> List BoardEvent
--singleBoardPath dir loc = case zipper of
--  Zipper Nil dir (Cons r rs) ->




-- Zipper Location -> (Zipper Location -> List BoardEvent) -> Zipper (List BoardEvent)
-- Zipper a -> (Zipper a -> b) -> Zipper b

-- 
pieceBoardEvent :: Zipper Location -> Maybe (List BoardEvent) 
pieceBoardEvent = case _ of 
  Zipper Nil _ Nil -> Nothing
  Zipper Nil _ (Cons _ _) -> Just Nil
  Zipper (Cons _ _) _ Nil -> Just Nil
  Zipper (Cons l _) v (Cons r _) -> do
    inDir <- directionTo v l
    outDir <- directionTo v r
    pure Nil -- fix this



