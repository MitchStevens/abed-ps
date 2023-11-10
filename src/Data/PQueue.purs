-- stolen from https://github.com/nullobject/purescript-pqueue/blob/master/src/Data/PQueue.purs
-- you should push a version update! 
module Data.PQueue
  ( PQueue(..)
  , fromFoldable
  , empty
  , singleton
  , isEmpty
  , insert
  , head
  , tail
  , init
  , last
  ) where

import Prelude

import Data.Foldable (class Foldable)
import Data.List (List(..))
import Data.List (fromFoldable, head, insertBy, last, null, singleton, sortBy) as L
import Data.List.Partial (init, tail) as PL
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, wrap, unwrap, over)
import Data.Tuple (Tuple(..), fst)
import Partial.Unsafe (unsafePartial)

-- | `PQueue p a` represents a queue of elements of type `a` with priorities of type `p`.
newtype PQueue p a = PQueue (List (Tuple p a))

derive instance newtypePQueue :: Newtype (PQueue p a) _

instance eqShow :: (Eq p, Eq a) => Eq (PQueue p a) where
  eq (PQueue as) (PQueue bs) = as == bs

instance showPQueue :: (Show p, Show a) => Show (PQueue p a) where
  show = show <<< unwrap

-- | Compare two elements in the queue.
cmp :: forall p a. Ord p => Tuple p a -> Tuple p a -> Ordering
cmp a b = compare (fst a) (fst b)

-- | Create a queue from a foldable structure.
fromFoldable :: forall p a f. Foldable f => Ord p => f (Tuple p a) -> PQueue p a
fromFoldable f = wrap $ L.sortBy cmp (L.fromFoldable f)

-- | Create an empty queue.
empty :: forall p a. PQueue p a
empty = wrap Nil

-- | Create a queue with a single element.
singleton :: forall p a. p -> a -> PQueue p a
singleton key value = wrap $ L.singleton (Tuple key value)

-- | Test whether a queue is empty.
isEmpty :: forall p a. PQueue p a -> Boolean
isEmpty = L.null <<< unwrap

-- | Insert an element into the queue.
insert :: forall p a. Ord p => p -> a -> PQueue p a -> PQueue p a
insert key value = over PQueue $ L.insertBy cmp (Tuple key value)

-- | Get the first element of a queue, `Nothing` if the queue is empty.
head :: forall p a. PQueue p a -> Maybe (Tuple p a)
head = L.head <<< unwrap

-- | Get all but the first element of a queue, `Nothing` if the queue is empty.
tail :: forall p a. PQueue p a -> Maybe (PQueue p a)
tail (PQueue Nil) = Nothing
tail queue = Just $ wrap $ unsafePartial $ PL.tail $ unwrap queue

-- | Get all but the last element of a queue, `Nothing` if the queue is empty.
init :: forall p a. PQueue p a -> Maybe (PQueue p a)
init (PQueue Nil) = Nothing
init queue = Just $ wrap $ unsafePartial $ PL.init $ unwrap queue

-- | Get the last element of a queue, `Nothing` if the queue is empty.
last :: forall p a. PQueue p a -> Maybe (Tuple p a)
last = L.last <<< unwrap

