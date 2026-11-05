{-
  Step 2 of compiling a `Board` to a netlist: decide which ports share a slot.

  Every port that carries the same signal belongs to one *net*, and each net
  gets one slot in the signal array. Nets are the equivalence classes of
  `Flat.links`, plus one more kind of link: a wire piece (`Connection`)
  joins each output to the input it copies, so wires never need evaluating --
  they just make their two ends the same net.

  Two slots are reserved, so a gate's `inputs`/`outputs` (step 3) can be
  total `Frame Int`s without a case for sides that have no port:

    - `zeroSlot`: nothing ever writes it, so a side with no port reads `zero`.
    - `scratchSlot`: a side with no port writes here, and nothing reads it.

  Every real port gets a net, even one linked to nothing; that net is just
  never written, so it reads `zero` too.

  A net may have at most one *writer*: a non-wire piece's writable port, or a
  register's tail (the register writes it between ticks). `flatten` should
  never produce more than one, so `MultipleWriters` means a compiler bug or a
  hand-built `Flat`, not a board a player made.
-}
module Game.Eval.Nets
  ( Nets
  , nets
  , scratchSlot
  , wireConnections
  , zeroSlot
  ) where

import Prelude

import Control.Alternative (guard)
import Control.Monad.ST (ST)
import Data.Array as A
import Data.Array.ST (STArray)
import Data.Array.ST as STA
import Data.Either (Either(..))
import Data.Foldable (fold, for_)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Set as S
import Data.Tuple (Tuple(..), fst)
import Game.Board.Types (BoardError(..))
import Game.Direction (CardinalDirection)
import Game.Eval.Flatten (Flat, Leaf, Link)
import Game.Frame (PortIndex)
import Game.Frame as Frame
import Game.Piece (Piece(..), getPorts)
import Game.Piece.Operation (PieceOperation(..))
import Game.Port (Port, hasPort, isReadable, isWritable)

type Nets =
  { slotCount :: Int
  , portSlot :: Map PortIndex Int
  -- | how many ports share each slot (`0` for the reserved ones) -- a port is
  -- | connected to something exactly when its net has more than one member
  , netSize :: Array Int
  }

zeroSlot :: Int
zeroSlot = 0

scratchSlot :: Int
scratchSlot = 1

firstNetSlot :: Int
firstNetSlot = 2

-- | A wire piece's routing, output side -> the input side it copies: `Just`
-- | exactly when the piece is compiled away rather than evaluated.
wireConnections :: Piece -> Maybe (Map CardinalDirection CardinalDirection)
wireConnections (Piece p) = case p.op of
  Connection connections -> Just connections
  _ -> Nothing

nets :: Flat -> Either BoardError Nets
nets flat = do
  for_ (M.values writersBySlot) \writers ->
    when (A.length writers > 1) do
      Left (MultipleWriters writers)
  pure { slotCount, portSlot, netSize }
  where
  leafPorts :: List (Tuple PortIndex { port :: Port, wire :: Boolean })
  leafPorts = do
    { index, piece } <- flat.leaves
    Tuple dir port <- Frame.toListWithIndex (getPorts piece)
    guard (hasPort port)
    let wire = wireConnections piece /= Nothing
    pure (Tuple (Tuple index dir) { port, wire })

  links :: List Link
  links = flat.links <> L.concatMap wireLinks flat.leaves

  members :: Array PortIndex
  members = S.toUnfoldable $ S.fromFoldable $ fold
    [ fst <$> leafPorts
    , do
        Tuple side port <- Frame.toListWithIndex flat.boundary
        guard (hasPort port)
        pure (Tuple Nil side)
    , links >>= \(Tuple a b) -> a : b : Nil
    , flat.registers >>= \{ mouth, tail } -> mouth : tail : Nil
    ]

  memberId :: Map PortIndex Int
  memberId = M.fromFoldable (A.mapWithIndex (flip Tuple) members)

  -- every member's root, after unioning every link
  roots :: Array Int
  roots = unionFind (A.length members) do
    Tuple a b <- links
    L.fromFoldable (Tuple <$> M.lookup a memberId <*> M.lookup b memberId)

  -- roots numbered densely, in member order, from `firstNetSlot`
  slotOfRoot :: Map Int Int
  slotOfRoot = M.fromFoldable (A.mapWithIndex (\i root -> Tuple root (firstNetSlot + i)) (A.nub roots))

  portSlot :: Map PortIndex Int
  portSlot = memberId <#> \i -> fromMaybe zeroSlot (A.index roots i >>= flip M.lookup slotOfRoot)

  slotCount :: Int
  slotCount = firstNetSlot + M.size slotOfRoot

  netSize :: Array Int
  netSize = A.range 0 (slotCount - 1) <#> \slot ->
    fromMaybe 0 (M.lookup slot sizes)
    where
    sizes = M.fromFoldableWith (+) (M.values portSlot <#> \slot -> Tuple slot 1)

  writersBySlot :: Map Int (Array PortIndex)
  writersBySlot = M.fromFoldableWith (flip (<>)) do
    idx <- fold
      [ L.mapMaybe (\(Tuple idx { port, wire }) -> if isWritable port && not wire then Just idx else Nothing) leafPorts
      , _.tail <$> flat.registers
      ]
    slot <- L.fromFoldable (M.lookup idx portSlot)
    pure (Tuple slot [ idx ])

-- | Join each of a wire's outputs to the input it copies. A malformed routing
-- | entry (one that doesn't read a readable side into a writable one) is
-- | ignored rather than merging nets it shouldn't.
wireLinks :: Leaf -> List Link
wireLinks { index, piece } = case wireConnections piece of
  Nothing -> Nil
  Just connections -> do
    Tuple out in_ <- M.toUnfoldable connections
    let ports = getPorts piece
    guard (isWritable (Frame.index out ports) && isReadable (Frame.index in_ ports))
    pure (Tuple (Tuple index out) (Tuple index in_))

-- | The root of each of `n` elements, after unioning every pair. Roots are
-- | always the smallest index in their class, so the result is deterministic.
unionFind :: Int -> List (Tuple Int Int) -> Array Int
unionFind n pairs
  | n <= 0 = []
  | otherwise = STA.run do
      parent <- STA.thaw (A.range 0 (n - 1))
      for_ pairs \(Tuple a b) -> do
        ra <- find parent a
        rb <- find parent b
        when (ra /= rb) do
          void (STA.poke (max ra rb) (min ra rb) parent)
      for_ (A.range 0 (n - 1)) \i -> find parent i
      pure parent

-- | `i`'s root, compressing the path to it on the way back.
find :: forall h. STArray h Int -> Int -> ST h Int
find parent i = do
  p <- fromMaybe i <$> STA.peek i parent
  if p == i
    then pure i
    else do
      root <- find parent p
      void (STA.poke i root parent)
      pure root
