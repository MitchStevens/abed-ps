module Game.Board.Path where

import Prelude

import Control.Alt (class Alt, alt, (<|>))
import Control.Alternative (guard)
import Control.Extend (extend)
import Control.Monad.Error.Class (class MonadError, liftEither, throwError)
import Control.Monad.Except (ExceptT(..), runExcept, runExceptT, withExceptT)
import Control.Monad.List.Trans (ListT, lift, nil)
import Control.Monad.List.Trans as ListT
import Control.Monad.Maybe.Trans (MaybeT)
import Control.Monad.State (class MonadState, StateT, evalState, evalStateT)
import Control.Monad.Writer (class MonadWriter)
import Data.Array (cons, find, foldr, head, last, length, snoc, (!!))
import Data.Array as A
import Data.Either (Either(..), blush, either, hush, isRight, note)
import Data.Foldable (fold, foldMap, for_, null, traverse_)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), isNothing)
import Data.PQueue as PQ
import Data.Set as S
import Data.Traversable (for, sequence, traverse)
import Data.Tuple (Tuple(..), snd)
import Data.Tuple.Nested (Tuple3, tuple3, uncurry3, (/\))
import Data.Unfoldable (unfoldr)
import Data.Zipper (Zipper(..))
import Data.Zipper as Z
import Debug (trace)
import Effect.Aff (Aff, error)
import Game.Board.Operation (addPieceNoUpdate, removePieceNoUpdate, updatePortsAround)
import Game.Board.PieceInfo (PieceInfo)
import Game.Board.Types (Board(..), BoardError, _pieces)
import Game.Piece.Direction (CardinalDirection, allDirections, clockwiseRotation, rotateDirection)
import Game.Piece.Direction as Direction
import Game.Location (Location(..), directionTo, followDirection)
import Game.Piece (chickenPiece, cornerCutPiece, crossPiece, idPiece, leftPiece, rightPiece)
import Game.Piece.Rotation (Rotation(..), rotation)

data PathError
  = ObstructedByAnotherPiece Location
  | LocationsAreNotAdjacent Location Location
  | PathIsEmpty
  | WireInputEqualsOutput CardinalDirection CardinalDirection
  | NoOverlay Wire Wire
  | BoardError BoardError
  | Other String
derive instance Eq PathError
-- TODO: improve error messages
instance Show PathError where
  show = case _ of
    ObstructedByAnotherPiece loc -> "obstructed by piece at " <> show loc
    LocationsAreNotAdjacent l1 l2 -> "locations " <> show l1 <> " and " <> show l2 <> " are not adjacent"
    PathIsEmpty -> "path is empty"
    WireInputEqualsOutput inputDirection outputDirection -> "expected that " <> show inputDirection <> " and " <> show outputDirection <> " are not equal"
    NoOverlay wire extant -> "no overlay between " <> show wire <> " and " <> show extant
    BoardError _ -> "boarderr "
    Other str -> "patherror: " <> str
instance Semigroup PathError where
  append a _ = a


type Wire =
  { inputDirection :: CardinalDirection
  , outputDirection :: CardinalDirection
  , location :: Location
  }


getWireAt :: forall m. MonadState Board m => Location -> ExceptT PathError m (Maybe Wire)
getWireAt location = do
  (maybePieceInfo :: Maybe PieceInfo) <- use (_pieces <<< at location)
  for maybePieceInfo \info -> do
    let inputDirection = rotateDirection Direction.Left info.rotation
    if info.piece == idPiece
      then pure { inputDirection, outputDirection: rotateDirection Direction.Right info.rotation, location }
    else if info.piece == leftPiece
      then pure { inputDirection, outputDirection: rotateDirection Direction.Up info.rotation, location }
    else if info.piece == rightPiece
      then pure { inputDirection, outputDirection: rotateDirection Direction.Down info.rotation, location }
    else throwError (ObstructedByAnotherPiece location)

overlayWires :: forall m. MonadState Board m
  => Wire -> Maybe Wire -> ExceptT PathError m Unit
overlayWires wire Nothing = do
  piece <- case clockwiseRotation wire.inputDirection wire.outputDirection of
    Rotation 1 -> pure leftPiece
    Rotation 2 -> pure idPiece
    Rotation 3 -> pure rightPiece
    _ -> throwError (WireInputEqualsOutput wire.inputDirection wire.outputDirection)
  withExceptT BoardError do
    addPieceNoUpdate wire.location piece (clockwiseRotation Direction.Left wire.inputDirection)
--- fug
-- start by finding the rotation such that there is one input on the left and one input on the side
-- then figure out whether it's a crossover or a corner cut
overlayWires wire (Just extant) = do
  ensureAllPortsFilled
  isCrossOver <|> isCornerCut <|> isChicken

  where
    noOverlay = NoOverlay wire extant
    wireRotation = clockwiseRotation wire.inputDirection wire.outputDirection
    extantRotation = clockwiseRotation extant.inputDirection extant.outputDirection

    ensureAllPortsFilled :: ExceptT PathError m Unit
    ensureAllPortsFilled = do
      unless (S.fromFoldable [wire.inputDirection, wire.outputDirection, extant.inputDirection, extant.outputDirection] == S.fromFoldable allDirections) do
        throwError (Other "all ports not filled")

    isCrossOver :: ExceptT PathError m Unit
    isCrossOver = do
      unless (wireRotation == rotation 2 && extantRotation == rotation 2) (throwError (Other "not a cross over"))
      rot <- case clockwiseRotation wire.inputDirection extant.inputDirection of
        Rotation 1 -> pure (clockwiseRotation Direction.Left wire.inputDirection)
        Rotation 3 -> pure (clockwiseRotation Direction.Left extant.inputDirection)
        _ -> throwError (noOverlay)
      withExceptT BoardError do
        _ <- removePieceNoUpdate extant.location
        addPieceNoUpdate extant.location crossPiece rot

    isCornerCut :: ExceptT PathError m Unit
    isCornerCut = do
      unless (wireRotation <> extantRotation == rotation 0) (throwError (Other ("not a cornercut" <> (show $ wireRotation <> extantRotation))))
      rot <- case clockwiseRotation wire.inputDirection extant.inputDirection of
        Rotation 1 -> pure (clockwiseRotation Direction.Left wire.inputDirection)
        Rotation 3 -> pure (clockwiseRotation Direction.Left extant.inputDirection)
        _ -> throwError (noOverlay)
      withExceptT BoardError do
        _ <- removePieceNoUpdate extant.location
        addPieceNoUpdate extant.location cornerCutPiece rot

    isChicken :: ExceptT PathError m Unit
    isChicken = do
      unless (wireRotation == extantRotation) (throwError (Other "not a chicken"))
      let rot = clockwiseRotation wire.inputDirection Direction.Left
      withExceptT BoardError do
        _ <- removePieceNoUpdate extant.location
        addPieceNoUpdate extant.location chickenPiece rot

{-
  ExceptT (State s (Either e a))
  = 
-}

rotateWire :: Rotation -> Wire -> Wire
rotateWire rot wire = wire { inputDirection = rotateDirection wire.inputDirection rot, outputDirection = rotateDirection wire.outputDirection rot}

triples :: forall a. List a -> List (Tuple3 a a a)
triples = case _ of
  a : b : c : xs -> tuple3 a b c : triples (b : c : xs)
  _ -> Nil

-- board path builds along all the locations
{-
  2. generate a list of board operations to add the pieces to the board
  3. ensure that every piece can be added to the board
  4. return the list of board events
-}
addBoardPath :: forall m. MonadState Board m
  => CardinalDirection -> Array Location -> CardinalDirection -> m Boolean
addBoardPath initialDir path terminalDir = do
  maybePathError <- blush <$> boardPathWithError initialDir path terminalDir
  when (isNothing maybePathError) do
    for_ (head path) updatePortsAround
    for_ (last path) updatePortsAround
  pure (isNothing maybePathError)


boardPathWithError :: forall m. MonadState Board m 
  => CardinalDirection -> Array Location -> CardinalDirection -> m (Either PathError Unit)
boardPathWithError initialDir path terminalDir = runExceptT do
  h <- liftEither $ note PathIsEmpty (head path)
  l <- liftEither $ note PathIsEmpty (last path)
  let initial  = followDirection h initialDir
  let terminal = followDirection l terminalDir
  let locations =  L.fromFoldable $ [ initial ] <> path <> [ terminal ]
  L.foldr (*>) (pure unit) $ map (uncurry3 singleWirePiece) (triples locations)

--singleWirePiece :: forall m. MonadState Board m => MonadWriter (Array Location) m => Alt m =>
singleWirePiece :: forall m. MonadState Board m 
  => Location -> Location -> Location -> ExceptT PathError m Unit
singleWirePiece l v r = do
  wire <- createWire l v r
  maybeExtant <- getWireAt v
  overlayWires wire maybeExtant


createWire :: forall m. Monad m => Location -> Location -> Location -> ExceptT PathError m Wire
createWire l v r = liftEither do
  inputDirection  <- note (LocationsAreNotAdjacent v l) (directionTo v l)
  outputDirection <- note (LocationsAreNotAdjacent v r) (directionTo v r)
  when (inputDirection == outputDirection)
    (Left $ WireInputEqualsOutput inputDirection outputDirection)
  pure $ { inputDirection, outputDirection, location: v }