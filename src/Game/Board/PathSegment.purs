module Game.Board.PathSegment where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Data.Array as A
import Data.Either (Either)
import Data.Generic.Rep (class Generic)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isJust, maybe)
import Data.Set as S
import Data.Show.Generic (genericShow)
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper(..))
import Game.Board.PieceInfo (PieceInfo)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection, clockwiseRotation, rotateDirection)
import Game.Direction as Direction
import Game.Location (Location(..), directionTo)
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

data PathSegmentError
  = InvalidSinglePath SinglePathSegment
  | InvalidDualPath SinglePathSegment SinglePathSegment
  | NoSimplificationForPiece Piece
derive instance Generic PathSegmentError _
derive instance Eq PathSegmentError
instance Show PathSegmentError where
  show = genericShow

--rotatePathSegment :: Rotation -> PathSegment -> PathSegment
--rotatePathSegment rot = case _ of
--  SinglePath path -> SinglePath (r path)
--  DualPath path1 path2 -> DualPath (r path1) (r path2)
--  where
--    r { from, to } =
--      { from: rotateDirection from rot, to: rotateDirection to rot }

singlePath
  :: CardinalDirection
  -> CardinalDirection 
  -> Either PathSegmentError SinglePathSegment
singlePath from to =
  if from /= to
    then pure {from, to}
    else throwError (InvalidSinglePath {from, to})

dualPath
  :: SinglePathSegment
  -> SinglePathSegment 
  -> Either PathSegmentError PathSegment
dualPath sp1 sp2 =
  if A.length (A.nub [sp1.from, sp1.to, sp2.from, sp2.to]) == 4
    then pure (DualPath (min sp1 sp2) (max sp1 sp2))
    else throwError (InvalidDualPath (min sp1 sp2) (max sp1 sp2))

{-
-}
singlePathSegmentFromPiece 
  :: PieceInfo
  -> Either PathSegmentError SinglePathSegment
singlePathSegmentFromPiece {piece, rotation} = 
  case isSimplifiable piece of
    Just (IsConnection connections) -> case M.toUnfoldable connections of
      [Tuple from to ] -> singlePath (rotateDirection from rotation) (rotateDirection to rotation)
      _ -> throwError (NoSimplificationForPiece piece)
    _ -> throwError (NoSimplificationForPiece piece)


{-
  Using the assertions of the `PathSegment` type, this function is made total via `crashWith`
-}
toPiece :: PathSegment -> PieceInfo
toPiece (SinglePath {from, to}) =
  let rotation = clockwiseRotation Direction.Left from
  in 
   { piece: mkWirePiece
    { capacity: OneBit
    , outputs: S.singleton (rotateDirection to (-rotation))
    }
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

{-
  This function asks: Given a path segment and a possible extant piece, does there exist a piece that would combine the functionality of the path segment and the extant piece

  Generally when creating a path, if there is a piece already on the board overlapping one of the locations of the path, the path will not be created. However when the piece is a wire piece, we are *sometimes* able to accomedate the new path if the wire piece is compatible.

  Say there is a row of identity pieces from one end of the board to the other. If a path were created starting at the top and ending at the bottom, we could replace the middle piece with a cross-piece which would preserve the transmission of the signal from left to right.

    ┏━━━━━┓                ┏━━┯━━┓ 
    ┠─────┨ -> add path -> ┠──┼──┨ 
    ┗━━━━━┛                ┗━━┷━━┛

  See tests for examples
-}
combineSegmentWithExtant :: SinglePathSegment -> Maybe PieceInfo -> Either PathSegmentError PieceInfo
combineSegmentWithExtant path = map toPiece <<< case _ of
  Nothing -> pure (SinglePath path)
  Just pieceInfo -> do
    extantPath <- singlePathSegmentFromPiece pieceInfo
    dualPath path extantPath