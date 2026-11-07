module Game.Piece.Types
  ( Piece(..)
  , defaultPortInfo
  , eval
  , getInputDirs
  , getOutputDirs
  , getPort
  , getPorts
  , name
  , truncateInputs
  , truncateOutputs
  )
  where

import Prelude

import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Game.Direction (CardinalDirection)
import Game.Frame (class Evaluable, Frame)
import Game.Frame as Frame
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Piece.PieceId (PieceId, pieceId)
import Game.Port (Port, hasPort, isInput, isOutput)
import Game.PortInfo (PortInfo, noPortInfo)
import Game.Signal (Signal, mkSignal)

{-
  What is a piece?

  - a piece has ports
  - A Piece MUST have at least one output
  - a piece has at least 1 output (or else what the hell does it do?)
  - a piece has at least 1 input
  - a piece can be evaluated
  - a piece has a unique identifier

-}
newtype Piece = Piece
  {-
    The operation of a `Piece` names its `eval` function (see `Game.Piece.Operation`), which is a function
      Signal^4 -> Signal^4
    which is exactly what `Frame Signal -> Frame Signal` is: one signal per side in, one per side out.

    Before the input signals are provided to the piece, the `Game` should truncate or zero out everything
    the piece doesn't read (see `Game.Frame.Framing`). A side the piece doesn't read is `zero`, and a side
    it doesn't write should be left `zero`.

    Imagine that `NOT4` is a piece that takes a 4 bit signal on the `Left` and outputs a 4 bit signal on the `Right`.
    ```
    -> NOT4 ->
    ```
    The operation of such a piece would be the same as the 1 bit and 8 bit not pieces: `Operation.Not`, whose `eval` is `\m -> Frame.singleton zero Right (not (Frame.index Left m))`.

    Everything else about a piece is derived from its operation and ports: see `Game.Piece.PieceId`, `Game.Piece.Property.Complexity`, `Game.Piece.Property.Ripple`, `Game.Piece.Transform.UpdateCapacity`, `Game.Piece.Transform.Adapt` and `Game.Piece.Property.Simplify`.
  -}
  { op :: PieceOperation
  , ports :: Frame Port
  }

derive instance Eq Piece
derive instance Ord Piece
instance Show Piece where
  show piece = "(Piece " <> show (name piece) <> ")"
derive instance Newtype Piece _

name :: Piece -> PieceId
name (Piece p) = pieceId p.op

eval :: Piece -> Frame Signal -> Frame Signal
eval (Piece p) = Operation.eval p.op

-- `Game.Frame` can't provide this itself (it would have to import this module
-- back); see the note on `Evaluable`.
instance Evaluable Piece where
  eval (Piece p) = Operation.eval p.op

getPorts :: Piece -> Frame Port
getPorts (Piece p) = p.ports

defaultPortInfo :: Piece -> Frame PortInfo
defaultPortInfo piece = getPorts piece <#> \port ->
  if hasPort port then { connected: false, port, signal: mkSignal 0 } else noPortInfo

getPort :: Piece -> CardinalDirection -> Maybe Port
getPort (Piece p) dir = Frame.lookupWhere hasPort dir p.ports

getInputDirs :: Piece -> Set CardinalDirection
getInputDirs (Piece p) = Frame.directionsWhere isInput p.ports

getOutputDirs :: Piece -> Set CardinalDirection
getOutputDirs (Piece p) = Frame.directionsWhere isOutput p.ports

{-
  Restrict a signal frame to the directions `piece` actually reads from each
  tick: its `Input` ports (driven by a neighbor) -- zeroing anything else, such as a stale signal left sitting on one of the piece's
  own output directions.
-}
truncateInputs :: Piece -> Frame Signal -> Frame Signal
truncateInputs (Piece p) inputs =
  (\port signal -> if isInput port then signal else zero) <$> p.ports <*> inputs

{-
  Restrict a signal frame (typically `eval`'s result) to the directions `piece`
  actually produces each tick: its `Output` ports (read by a neighbor) --
  zeroing anything else, such as a stray value on one of the piece's own input
  directions.
-}
truncateOutputs :: Piece -> Frame Signal -> Frame Signal
truncateOutputs (Piece p) outputs =
  (\port signal -> if isOutput port then signal else zero) <$> p.ports <*> outputs