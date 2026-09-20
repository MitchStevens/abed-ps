module Game.Piece.Wormhole where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece (Piece, PieceId(..), mkPieceNoAdapt)
import Game.Port (inputPort, noPort, outputPort, wormholeIn, wormholeOut)

{-
  `counter`, wired to itself through a wormhole, counts up by one every tick.

    - Down (wormholeOut) : the count buffered from the previous tick
    - Up   (wormholeIn)  : that count + 1, pushed back into the wormhole
    - Left (outputPort)  : the current count, observable

  `tick`ed n times from a zero buffer, the Down buffer holds n and the Left
  output reads n.
-}
counter :: Piece
counter = mkPieceNoAdapt
  { name: PieceId "counter"
  , eval: \inputs ->
      let n = Frame.index Direction.Down inputs
      in Frame.fromFoldable zero
        [ Tuple Direction.Up (n + one)
        , Tuple Direction.Left n
        ]
  , ports: Frame.fromFoldable noPort
    [ Tuple Direction.Up (wormholeIn EightBit)
    , Tuple Direction.Left (outputPort EightBit)
    , Tuple Direction.Down (wormholeOut EightBit)
    ]
  , complexity: mempty
  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }


{-
  `risingEdge` outputs one for a single tick when its watched input goes from
  zero to one, and zero otherwise. It remembers the previous tick's input
  through a wormhole.

    - Left  (inputPort)   : the watched signal
    - Down  (wormholeOut) : the previous tick's watched signal
    - Up    (wormholeIn)  : this tick's watched signal, kept for next tick
    - Right (outputPort)  : one on a rising edge, else zero
-}
risingEdge :: Piece
risingEdge = mkPieceNoAdapt
  { name: PieceId "rising-edge"
  , eval: \inputs ->
      let curr = Frame.index Direction.Left inputs
          prev = Frame.index Direction.Down inputs
          edge = if curr == one && prev == zero then one else zero
      in Frame.fromFoldable zero
        [ Tuple Direction.Up curr
        , Tuple Direction.Right edge
        ]
  , ports: Frame.fromFoldable noPort
    [ Tuple Direction.Up (wormholeIn OneBit)
    , Tuple Direction.Down (wormholeOut OneBit)
    , Tuple Direction.Left (inputPort OneBit)
    , Tuple Direction.Right (outputPort OneBit)
    ]
  , complexity: mempty
  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }