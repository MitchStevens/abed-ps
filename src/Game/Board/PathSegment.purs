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
newtype PathSegment = PathSegment (Map CardinalDirection CardinalDirection)
derive instance Generic PathSegment _
derive instance Eq PathSegment
instance Show PathSegment where
  show = genericShow

data PathSegmentError
  = InvalidPathSegment (Map CardinalDirection CardinalDirection)
  | CantCombinePathSegments PathSegment PathSegment
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
  -> Either PathSegmentError PathSegment
singlePath from to = pathSegment (M.singleton from to)

pathSegment :: Map CardinalDirection CardinalDirection -> Either PathSegmentError PathSegment
pathSegment connections = 
  if S.size (M.keys connections <> S.fromFoldable (M.values connections)) == M.size connections * 2
    then pure (PathSegment connections) 
    else throwError (InvalidPathSegment connections)


{-
  When can we combine path segments? Precisly when the combined connection maps form a valid `PathSegment`
-}
combine
  :: PathSegment
  -> PathSegment
  -> Either PathSegmentError PathSegment
combine path1@(PathSegment conn1) path2@(PathSegment conn2) = do
  let conn3 = M.union conn1 conn2
  when (M.isSubmap conn1 conn3 || M.isSubmap conn2 conn3) do
    throwError (CantCombinePathSegments path1 path2)
  pathSegment conn3
  
{-
-}
fromPiece 
  :: PieceInfo
  -> Either PathSegmentError PathSegment
fromPiece {piece, rotation} = 
  case isSimplifiable piece of
    Just (Connection connections) -> pathSegment connections
    _ -> throwError (NoSimplificationForPiece piece)


{-
  Using the assertions of the `PathSegment` type, this function is made total via `crashWith`
-}
toPiece :: PathSegment -> PieceInfo
toPiece (PathSegment connections) = case M.toUnfoldable connections of
  [ Tuple from to ] ->
    let rotation = clockwiseRotation Direction.Left from
    in 
    { piece: mkWirePiece
      { capacity: OneBit
      , outputs: S.singleton (rotateDirection to (-rotation))
      }
    , rotation
    }
  [ Tuple from1 to1, Tuple from2 to2 ] ->
    let Rotation r1 = clockwiseRotation from1 to1
        Rotation r2 = clockwiseRotation from1 from2
        Rotation r3 = clockwiseRotation from1 to2
        rotation = clockwiseRotation Direction.Left from1
    in case r1, r2, r3 of
      1, 2, 3 -> { piece: reverseChickenPiece, rotation}
      1, 3, 2 -> { piece: cornerCutPiece,      rotation: (rotation <> Rotation 1 )}
      2, 1, 3 -> { piece: crossPiece,          rotation}
      2, 3, 1 -> { piece: crossPiece,          rotation: (rotation <> Rotation 1)}
      3, 1, 2 -> { piece: cornerCutPiece,      rotation}
      3, 2, 1 -> { piece: chickenPiece,        rotation}
      _, _, _ -> unsafeCrashWith ("couldn't create a piece")
  _ -> unsafeCrashWith ("couldn't create a piece")

{-
  This function asks: Given a path segment and a possible extant piece, does there exist a piece that would combine the functionality of the path segment and the extant piece

  Generally when creating a path, if there is a piece already on the board overlapping one of the locations of the path, the path will not be created. However when the piece is a wire piece, we are *sometimes* able to accomedate the new path if the wire piece is compatible.

  Say there is a row of identity pieces from one end of the board to the other. If a path were created starting at the top and ending at the bottom, we could replace the middle piece with a cross-piece which would preserve the transmission of the signal from left to right.

    ┏━━━━━┓                ┏━━┯━━┓ 
    ┠─────┨ -> add path -> ┠──┼──┨ 
    ┗━━━━━┛                ┗━━┷━━┛

  Possbible valid combinations:
    **Extant Piece is `Nothing`**: 

-}
combineSegmentWithExtant :: PathSegment -> Maybe PieceInfo -> Either PathSegmentError PieceInfo
combineSegmentWithExtant segment = map toPiece <<< case _ of
  Nothing -> pure segment
  Just pieceInfo -> do
    extantPathSegment <- fromPiece pieceInfo
    combine segment extantPathSegment