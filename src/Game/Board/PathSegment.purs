module Game.Board.PathSegment where

import Prelude

import Control.Monad.Error.Class (class MonadError, throwError)
import Data.Array as A
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isJust)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Game.Board.PieceInfo (PieceInfo)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection, clockwiseRotation, rotateDirection)
import Game.Direction as Direction
import Game.Location (directionTo)
import Game.Piece (chickenPiece, cornerCutPiece, crossPiece, mkWirePiece, reverseChickenPiece)
import Game.Rotation (Rotation(..))
import Halogen.Svg.Attributes (m)
import Partial.Unsafe (unsafeCrashWith)

{-
  Assertions:

-}
data PathSegment
  = SinglePath { from :: CardinalDirection, to :: CardinalDirection }
  | DualPath
    { from1 :: CardinalDirection
    , to1 :: CardinalDirection
    , from2 :: CardinalDirection
    , to2 :: CardinalDirection
    }

data PathSegmentError
  = NoOverlay PathSegment PathSegment
  | InvalidSinglePath CardinalDirection CardinalDirection
  | PathSegmentError

singlePath :: forall m
  .  MonadError PathSegmentError m
  =>  CardinalDirection -> CardinalDirection -> m PathSegment
singlePath from to =
  if from /= to
    then pure (SinglePath {from, to})
    else throwError (InvalidSinglePath from to)

dualPath :: forall m. MonadError PathSegmentError m
  => { from :: CardinalDirection, to :: CardinalDirection }
  -> { from :: CardinalDirection, to :: CardinalDirection }
  -> m PathSegment
dualPath s1 s2 =
  if A.length (A.nub [s1.from, s1.to, s2.from, s2.to]) == 4
    then pure (DualPath { from1: s1.from, to1: s1.to, from2: s2.from, to2: s2.to })
    else throwError PathSegmentError

--combineSegments :: forall m
--  .  MonadError PathSegment m
--  => PathSegment -> PathSegment -> m PathSegment
--combineSegments p1 p2 = case p1, p2 of
--  SinglePath s1, SinglePath s2 -> dualPath s1 s2
--  _, _ -> throwError (NoOverlay p1 p2)
--
--pathSegmentAt :: CardinalDirection -> CardinalDirection -> Zipper Location -> m PathSegment
--pathSegmentAt initialDirection terminalDirection (Zipper ls v rs) = do
--  let from = fromMaybe initialDirection   (L.head ls >>= directionTo v)
--  let to   = fromMaybe terminalDirection  (L.head rs >>= directionTo v)
--  singlePath from to
--
--fromPiece :: forall m. MonadError PathSegmentError m
--  => PieceInfo -> m PathSegment
--fromPiece {piece, rotation} = do
--  simplification <- isSimplifiable piece
--  case simplification of
--    IsConstant _ ->
--    IsConnection connections -> case M.toUnfoldable connections of
--      [Tuple from to ]
--      [Tuple from1 to1, Tuple from2 to2] -> dualPath from1 
--
--
--{-
--  Using the assertions of the `PathSegment` type, this function is made total via `crashWith`
---}
--toPiece :: PathSegment -> PieceInfo
--toPiece (SinglePath {from, to}) =
--  let rotation = clockwiseRotation Direction.Left from
--  in Tuple (mkWirePiece { capacity: OneBit, outputs: S.singleton (rotateDirection to rot) }) rot
--toPiece (DualPath {from1, to1,  from2, to2}) =
--  let Rotation r1 = clockwiseRotation from1 to1
--      Rotation r2 = clockwiseRotation from1 from2
--      Rotation r3 = clockwiseRotation from1 to2
--      rotation = clockwiseRotation Direction.Left from1
--  in case r1, r2, r3 of
--    1, 2, 3 -> Tuple reverseChickenPiece rotation
--    1, 3, 2 -> Tuple cornerCutPiece      (rotation <> Rotation 1 )
--    2, 1, 3 -> Tuple crossPiece          rotation
--    2, 3, 1 -> Tuple crossPiece          (rotation <> Rotation 1)
--    3, 1, 2 -> Tuple cornerCutPiece      rotation
--    3, 2, 1 -> Tuple chickenPiece        rotation
--    _       -> unsafeCrashWith ("couldn't create a piece")



