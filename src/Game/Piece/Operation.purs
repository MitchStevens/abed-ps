module Game.Piece.Operation
  ( PieceOperation(..)
  , eval
  , fuseSignals
  , severSignal
  ) where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Map (Map)
import Data.Ord (greaterThan, lessThan)
import Data.Show.Generic (genericShow)
import Data.Tuple (Tuple(..))
import Data.UInt (UInt, fromInt, shl, shr, (.&.), (.|.))
import Data.UInt as UInt
import Game.Capacity (Capacity)
import Game.Capacity as Capacity
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Signal (Signal, maxValue, mkSignal, over2Signal, overSignal, xor)

{-
  Instead of adding an `eval :: Frame Signal -> Frame Signal` to every piece, we provide each piece with an operation. This operation can be then used to lookup an eval function.
  This indirect way of specifing the eval function is a form of defunctionalisation, and allows us to define an instance of `Eq` without doing something akward like doing a pieceId lookup.
  This also allows us to write a good Eq defn for Board.

  This module is designed for qualified import
 -}

data PieceOperation
  -- basic gates: read `Left` (and `Up`, for the binary ones), write `Right`
  = Not
  | Or
  | And
  | Xor
  {-
    Copies signals straight across the piece, with no logic: each entry maps an output direction to the input direction it copies. This is every wire piece, single or dual, and has the same shape as the `Connection` simplification of those pieces.
  -}
  | Connection (Map CardinalDirection CardinalDirection)
  -- arithmetic
  | Succ Capacity
  | Adder Capacity
  | Multiplier
  -- `Fuse` holds the capacity of its inputs, `Sever` the capacity of its outputs
  | Fuse Capacity
  | Sever Capacity
  -- unary: read `Left`, write `Right`
  | ShiftLeft Int
  | ShiftRight Int
  | TwoBitCrossOver
  -- comparison: compare `Left` to `Up`, write `one` or `zero` to `Right`
  | Equal
  | GreaterThan
  | LessThan
  -- wormhole pieces
  | Counter
  | RisingEdge
  {-
    Deliberately malformed operations, for testing that truncation protects a board from them (see `Test.Game.Eval.Netcode`). No real piece should use these.
  -}
  | ReadsOwnOutput
  | WritesOwnInput

derive instance Eq PieceOperation
derive instance Ord PieceOperation
derive instance Generic PieceOperation _
instance Show PieceOperation where
  show = genericShow

eval :: PieceOperation -> Frame Signal -> Frame Signal
eval = case _ of
  Not -> \m -> Frame.singleton zero Direction.Right (not (Frame.index Direction.Left m))
  Or -> binary (||)
  And -> binary (&&)
  Xor -> binary xor

  Connection connections -> \m ->
    Frame.fromMap zero ((\input -> Frame.index input m) <$> connections)

  Succ capacity -> \m ->
    let s = Frame.index Direction.Left m
    in Frame.singleton zero Direction.Right (if s == maxValue capacity then zero else s + one)
  Adder capacity -> \m ->
    let a = Frame.index Direction.Left m
        b = Frame.index Direction.Up m
        sum = a + b
        carry = if sum > maxValue capacity then one else zero
    in Frame.fromFoldable zero
        [ Tuple Direction.Right sum
        , Tuple Direction.Down carry
        ]
  Multiplier -> binary (*)

  Fuse inputCapacity -> \m ->
    let high = Frame.index Direction.Up m
        low  = Frame.index Direction.Down m
    in Frame.singleton zero Direction.Right (fuseSignals inputCapacity high low)
  Sever outputCapacity -> \m ->
    let Tuple high low = severSignal outputCapacity (Frame.index Direction.Left m)
    in Frame.fromFoldable zero
        [ Tuple Direction.Up high
        , Tuple Direction.Down low
        ]

  ShiftLeft bitShift -> unary \n -> shl n (fromInt bitShift)
  ShiftRight bitShift -> unary \n -> shr n (fromInt bitShift)
  TwoBitCrossOver -> unary \n ->
    let b0 = if UInt.and (fromInt 2) n > zero then one else zero
        b1 = if UInt.and (fromInt 1) n > zero then one else zero
    in shl b1 one + b0

  Equal -> comparison eq
  GreaterThan -> comparison greaterThan
  LessThan -> comparison lessThan

  Counter -> \m ->
    let n = Frame.index Direction.Down m
    in Frame.fromFoldable zero
        [ Tuple Direction.Up (n + one)
        , Tuple Direction.Left n
        ]
  RisingEdge -> \m ->
    let curr = Frame.index Direction.Left m
        prev = Frame.index Direction.Down m
        edge = if curr == one && prev == zero then one else zero
    in Frame.fromFoldable zero
        [ Tuple Direction.Up curr
        , Tuple Direction.Right edge
        ]

  ReadsOwnOutput -> \m ->
    Frame.singleton zero Direction.Right (Frame.index Direction.Right m + one)
  WritesOwnInput -> \m ->
    Frame.fromFoldable zero
      [ Tuple Direction.Right (Frame.index Direction.Left m)
      , Tuple Direction.Left (mkSignal 99)
      ]

-- | Combine `Left` and `Up`, writing the result to `Right`.
binary :: (Signal -> Signal -> Signal) -> Frame Signal -> Frame Signal
binary f m = Frame.singleton zero Direction.Right (f (Frame.index Direction.Left m) (Frame.index Direction.Up m))

unary :: (UInt -> UInt) -> Frame Signal -> Frame Signal
unary f m = Frame.singleton zero Direction.Right (overSignal f (Frame.index Direction.Left m))

comparison :: (Signal -> Signal -> Boolean) -> Frame Signal -> Frame Signal
comparison f = binary \a b -> if f a b then one else zero

fuseSignals :: Capacity -> Signal -> Signal -> Signal
fuseSignals inputCapacity = over2Signal $ \high low ->
  shl high n .|. (low .&. (shl one n - one))
  where
    n = fromInt (Capacity.toInt inputCapacity)

severSignal :: Capacity -> Signal -> Tuple Signal Signal
severSignal outputCapacity signal = Tuple high low
  where
    high = overSignal (\s -> shr s n) signal
    low = overSignal (\s -> s .&. (shl one n - one)) signal
    n = fromInt (Capacity.toInt outputCapacity)
