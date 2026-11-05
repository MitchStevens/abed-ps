module Game.Frame where

import Prelude

import Data.Foldable (foldl)
import Data.FoldableWithIndex (class FoldableWithIndex)
import Data.FunctorWithIndex (class FunctorWithIndex, mapWithIndex)
import Data.Lens (Lens', lens)
import Data.List (List(..), (:))
import Data.List as List
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Set (Set)
import Data.Set as Set
import Data.Traversable (class Foldable, class Traversable, sequence)
import Data.TraversableWithIndex (class TraversableWithIndex)
import Data.Tuple (Tuple(..), fst, snd)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Location (Location)
import Game.Signal (Signal)
import Test.QuickCheck (class Arbitrary, arbitrary)

-- | The path of locations from the root down to a piece. Usually non-empty
-- | (every piece normally sits inside at least one board level), but `Board`
-- | itself can be a bare `Piece` with no enclosing board at all (`pureBoard`),
-- | so `Nil` has to be a legal address too -- that's what `compilePiece`
-- | gives it.
type PieceIndex = List Location

-- | One port of one piece, addressed globally.
type PortIndex = Tuple PieceIndex CardinalDirection

-- | One value per side of a piece.
newtype Frame a = Frame { u :: a, r :: a, d :: a, l :: a }

toList :: forall a. Frame a -> List a
toList (Frame x) = x.u : x.r : x.d : x.l : Nil

toListWithIndex :: forall a. Frame a -> List (Tuple CardinalDirection a)
toListWithIndex (Frame x) =
  Tuple Direction.Up x.u
    : Tuple Direction.Right x.r
    : Tuple Direction.Down x.d
    : Tuple Direction.Left x.l
    : Nil

-- | The value on one side.
index :: forall a. CardinalDirection -> Frame a -> a
index dir (Frame x) = case dir of
  Direction.Up -> x.u
  Direction.Right -> x.r
  Direction.Down -> x.d
  Direction.Left -> x.l

-- | Build a `Frame` by asking for each side's value.
tabulate :: forall a. (CardinalDirection -> a) -> Frame a
tabulate f = Frame
  { u: f Direction.Up
  , r: f Direction.Right
  , d: f Direction.Down
  , l: f Direction.Left
  }

-- | A `Map`'s entries as a `Frame`, `default` on every side the map lacks.
fromMap :: forall a. a -> Map CardinalDirection a -> Frame a
fromMap default m = tabulate \dir -> fromMaybe default (M.lookup dir m)

-- | Replace the value on one side, leaving the other three alone.
set :: forall a. CardinalDirection -> a -> Frame a -> Frame a
set dir value = mapWithIndex \d old -> if d == dir then value else old

-- | A lens onto one side.
_side :: forall a. CardinalDirection -> Lens' (Frame a) a
_side dir = lens (index dir) (\frame value -> set dir value frame)

-- | `value` on one side, `default` on the other three.
singleton :: forall a. a -> CardinalDirection -> a -> Frame a
singleton default dir value = set dir value (pure default)

-- | `default` on every side no entry names. If several entries name the same
-- | side the last one wins, as with `Map.fromFoldable`.
fromFoldable :: forall f a. Foldable f => a -> f (Tuple CardinalDirection a) -> Frame a
fromFoldable default = foldl (\frame (Tuple dir value) -> set dir value frame) (pure default)

-- | The value on one side, if it satisfies `p` -- how a total `Frame` is read
-- | back as the sparse lookup a `Map` gave (`p` says which values are "there",
-- | e.g. `hasPort` for a `Frame Port`).
lookupWhere :: forall a. (a -> Boolean) -> CardinalDirection -> Frame a -> Maybe a
lookupWhere p dir frame =
  let value = index dir frame
  in if p value then Just value else Nothing

-- | The sides whose value satisfies `p`.
directionsWhere :: forall a. (a -> Boolean) -> Frame a -> Set CardinalDirection
directionsWhere p frame = Set.fromFoldable (fst <$> List.filter (p <<< snd) (toListWithIndex frame))

-- | The sides whose value satisfies `keep`, as a `Map` -- the sparse view of a
-- | total `Frame`, for code that has to do something once per side that's
-- | really there (draw a port, say). The inverse of `fromMap` when every
-- | dropped side holds `fromMap`'s default.
toMapBy :: forall a. (a -> Boolean) -> Frame a -> Map CardinalDirection a
toMapBy keep frame = M.fromFoldable (List.filter (keep <<< snd) (toListWithIndex frame))

instance Show a => Show (Frame a) where
  show (Frame x) = "(Frame " <> show x <> ")"

derive newtype instance Eq a => Eq (Frame a)

derive newtype instance Ord a => Ord (Frame a)

instance Functor Frame where
  map f (Frame x) = Frame { u: f x.u, r: f x.r, d: f x.d, l: f x.l }

instance Apply Frame where
  apply (Frame f) (Frame x) = Frame { u: f.u x.u, r: f.r x.r, d: f.d x.d, l: f.l x.l }

-- | The same value on every side.
instance Applicative Frame where
  pure a = Frame { u: a, r: a, d: a, l: a }

instance Arbitrary a => Arbitrary (Frame a) where
  arbitrary = sequence (pure arbitrary)

instance Foldable Frame where
  foldl f z frame = List.foldl f z (toList frame)
  foldr f z frame = List.foldr f z (toList frame)
  foldMap f frame = List.foldMap f (toList frame)

instance Traversable Frame where
  traverse f (Frame x) = ado
    u <- f x.u
    r <- f x.r
    d <- f x.d
    l <- f x.l
    in Frame { u, r, d, l }
  sequence (Frame x) = ado
    u <- x.u
    r <- x.r
    d <- x.d
    l <- x.l
    in Frame { u, r, d, l }

instance FunctorWithIndex CardinalDirection Frame where
  mapWithIndex f (Frame x) = Frame
    { u: f Direction.Up x.u
    , r: f Direction.Right x.r
    , d: f Direction.Down x.d
    , l: f Direction.Left x.l
    }

instance FoldableWithIndex CardinalDirection Frame where
  foldlWithIndex f z frame = List.foldl (\acc (Tuple i a) -> f i acc a) z (toListWithIndex frame)
  foldrWithIndex f z frame = List.foldr (\(Tuple i a) acc -> f i a acc) z (toListWithIndex frame)
  foldMapWithIndex f frame = List.foldMap (\(Tuple i a) -> f i a) (toListWithIndex frame)

instance TraversableWithIndex CardinalDirection Frame where
  traverseWithIndex f (Frame x) = ado
    u <- f Direction.Up x.u
    r <- f Direction.Right x.r
    d <- f Direction.Down x.d
    l <- f Direction.Left x.l
    in Frame { u, r, d, l }

-- | Reading and writing the `Frame` of whichever piece is currently in focus.
-- |
-- | Truncation is part of the contract, not the caller's job:
-- |
-- | * `readFrame` is `zero` on every side whose port isn't `isReadable`
-- |   (including a side with no port at all).
-- | * `writeFrame` only changes sides whose port is `isWritable`; every other
-- |   side keeps the value it already had. (A non-writable slot can hold a
-- |   value seeded from outside -- a board input, a wormhole tail -- and a
-- |   piece's own write must not wipe it.)
-- |
-- | Since a port is never both readable and writable, the two are not
-- | inverses: `readFrame >>= writeFrame` doesn't leave things as it found
-- | them, it clears the piece's outputs (`writeFrame (pure zero)`).
-- |
-- | `withLocation` is scoped rather than a push/pop pair, so it can't be left
-- | unbalanced. It doesn't check that `loc` exists -- callers get a location
-- | from the same map entry as the thing they evaluate there.
class Monad m <= Framing m where
  writeFrame :: Frame Signal -> m Unit
  readFrame :: m (Frame Signal)
  withLocation :: forall a. Location -> m a -> m a

-- | Run at the piece addressed by its whole path from the root -- one
-- | `withLocation` per step, root first. A `PieceIndex` from a flattened
-- | board is exactly such a path.
atPath :: forall m a. Framing m => PieceIndex -> m a -> m a
atPath path m = List.foldr withLocation m path

-- | Something that turns its inputs' `Frame` into its outputs'. Truncation is
-- | `Framing`'s job, so an instance needn't worry about stray values on sides
-- | it doesn't read or write.
-- |
-- | `Piece`'s instance lives in `Game.Piece.Types`, next to the type: a `Piece`'s
-- | own `eval` is a `Frame Signal -> Frame Signal`, so `Game.Piece.Types` has to
-- | import this module, and this one can't import it back.
class Evaluable ev where
  eval :: ev -> Frame Signal -> Frame Signal


evaluate :: forall m ev. Framing m => Evaluable ev => ev -> m Unit
evaluate ev = readFrame >>= (writeFrame <<< eval ev)
