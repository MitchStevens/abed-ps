module Game.Board.PathSegment where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Data.Array as A
import Data.Generic.Rep (class Generic)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isJust)
import Data.Set as S
import Data.Show.Generic (genericShow)
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Game.Board.PieceInfo (PieceInfo)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection, clockwiseRotation, rotateDirection)
import Game.Direction as Direction
import Game.Location (directionTo)
import Game.Piece (Piece(..), Simplification(..), chickenPiece, cornerCutPiece, crossPiece, isSimplifiable, mkWirePiece, reverseChickenPiece)
import Game.Rotation (Rotation(..), rotation)
import Halogen.Svg.Attributes (m)
import Partial.Unsafe (unsafeCrashWith)

{-
  Assertions:

-}
type SinglePathSegment = { from :: CardinalDirection, to :: CardinalDirection }

data PathSegment
  = SinglePath SinglePathSegment
  | DualPath SinglePathSegment SinglePathSegment
derive instance Generic PathSegment _
derive instance Eq PathSegment
instance Show PathSegment where
  show = genericShow

rotatePathSegment :: Rotation -> PathSegment -> PathSegment
rotatePathSegment rot = case _ of
  SinglePath path -> SinglePath (r path)
  DualPath path1 path2 -> DualPath (r path1) (r path2)
  where
    r { from, to } =
      { from: rotateDirection from rot, to: rotateDirection to rot }

data PathSegmentError
  = InvalidSinglePath SinglePathSegment
  | InvalidDualPath SinglePathSegment SinglePathSegment
  | NoSimplificationForPiece Piece
derive instance Generic PathSegmentError _
derive instance Eq PathSegmentError
instance Show PathSegmentError where
  show = genericShow


singlePath :: forall m
  .  MonadThrow PathSegmentError m
  =>  CardinalDirection -> CardinalDirection -> m SinglePathSegment
singlePath from to =
  if from /= to
    then pure {from, to}
    else throwError (InvalidSinglePath {from, to})

dualPath :: forall m. MonadThrow PathSegmentError m
  => SinglePathSegment -> SinglePathSegment -> m PathSegment
dualPath sp1 sp2 =
  if A.length (A.nub [sp1.from, sp1.to, sp2.from, sp2.to]) == 4
    then pure (DualPath (min sp1 sp2) (max sp1 sp2))
    else throwError (InvalidDualPath (min sp1 sp2) (max sp1 sp2))

--pathSegmentAt :: CardinalDirection -> CardinalDirection -> Zipper Location -> m PathSegment
--pathSegmentAt initialDirection terminalDirection (Zipper ls v rs) = do
--  let from = fromMaybe initialDirection   (L.head ls >>= directionTo v)
--  let to   = fromMaybe terminalDirection  (L.head rs >>= directionTo v)
--  singlePath from to
--

fromPiece :: forall m. MonadThrow PathSegmentError m
  => PieceInfo -> m PathSegment
fromPiece {piece, rotation} = rotatePathSegment rotation <$>
  case isSimplifiable piece of
    Just (IsConnection connections) -> case M.toUnfoldable connections of
      [Tuple from to ] -> SinglePath <$> singlePath from to
      [Tuple from1 to1, Tuple from2 to2] ->
        dualPath { from: from1, to: to1 }  { from: from2, to: to2 }
      _ -> throwError (NoSimplificationForPiece piece)
    _ -> throwError (NoSimplificationForPiece piece)


{-
  Using the assertions of the `PathSegment` type, this function is made total via `crashWith`
-}
toPiece :: PathSegment -> PieceInfo
toPiece (SinglePath {from, to}) =
  let rotation = clockwiseRotation Direction.Left from
  in 
   { piece: mkWirePiece { capacity: OneBit, outputs: S.singleton (rotateDirection to (-rotation)) }
   , rotation
   }
toPiece (DualPath sp1 sp2) =
  let Rotation r1 = clockwiseRotation sp1.from sp1.to
      Rotation r2 = clockwiseRotation sp1.from sp2.from
      Rotation r3 = clockwiseRotation sp1.from sp2.to
      rotation = clockwiseRotation Direction.Left sp1.from
  in case r1, r2, r3 of
    1, 2, 3 -> { piece: reverseChickenPiece, rotation}
    1, 3, 2 -> { piece: cornerCutPiece,      rotation: (rotation <> Rotation 1 )}
    2, 1, 3 -> { piece: crossPiece,          rotation}
    2, 3, 1 -> { piece: crossPiece,          rotation: (rotation <> Rotation 1)}
    3, 1, 2 -> { piece: cornerCutPiece,      rotation}
    3, 2, 1 -> { piece: chickenPiece,        rotation}
    _, _, _ -> unsafeCrashWith ("couldn't create a piece")



