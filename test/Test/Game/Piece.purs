module Test.Game.Piece where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Error.Class (class MonadError, class MonadThrow, catchError, throwError)
import Data.Array (fold)
import Data.Array as A
import Data.Foldable (find, for_)
import Data.FoldableWithIndex (allWithIndex, forWithIndex_)
import Data.Functor (($>))
import Data.FunctorWithIndex (mapWithIndex)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Data.Set as S
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection(..))
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Piece (Piece(..), PieceId(..), adapt, allPieces, andPiece, chickenPiece, complexity, crossPiece, eval, fusePiece, getPorts, idPiece, intersectionRightPiece, mkAdder, mkFusePiece, mkMultiplier, mkSeverPiece, mkShiftLeftBy, mkShiftRightBy, mkSuccPiece, mkWirePiece, name, notPiece, pieceVault, reverseChickenPiece, severPiece, shouldRipple, space, succPiece, superPiece, truncateInputs, twoBitCrossOver, updateCapacity)
import Game.Piece.Catalogue.Comparison (mkEqualPiece, mkGreaterThanPiece, mkLessThanPiece)
import Game.Piece.Operation as Operation
import Game.Port (hasPort, inputPort, isOutput, noPort, portCapacity)
import Game.Signal (Signal, equivalent, mkSignal)
import Test.Game.Signal (shouldBeEquivalentTo)
import Test.QuickCheck (Result(..), arbitrary, assertEquals, withHelp)
import Test.QuickCheck.Gen (Gen)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)
import Text.Printf (printf)
import Type.Proxy (Proxy(..))

testEval :: forall m. MonadError Error m => Piece -> Frame Signal -> Frame Signal -> m Unit
testEval piece inputs expected = do
  let recieved = eval piece inputs 
  forWithIndex_ (portCapacity <$> getPorts piece) \dir capacity -> 
    shouldBeEquivalentTo capacity (Frame.index dir expected) (Frame.index dir recieved)
      `catchError` \e ->
        throwError e *> (fail $ " in direction " <> show dir)

spec :: Spec Unit
spec =
  describe "Game.Piece" do
    it "piece names are unique" do
      A.length allPieces `shouldEqual` M.size pieceVault

    describe "name" do
      it "derives the expected id for every piece" do
        map (show <<< name) allPieces `shouldEqual`
          [ "not-piece", "or-piece", "and-piece", "xor-piece"
          , "id-piece", "left-piece", "right-piece", "super-piece"
          , "cross-piece", "corner-cut-piece", "chicken-piece", "reverse-chicken-piece"
          , "fuse-piece", "sever-piece"
          ]
      it "names adapted wires" do
        name intersectionRightPiece `shouldEqual` PieceId "intersection-right-piece"
      it "names the pieces outside the vault" do
        name (mkShiftLeftBy 1 OneBit) `shouldEqual` PieceId "shift-left-piece"
        name (mkShiftRightBy 1 OneBit) `shouldEqual` PieceId "shift-right-piece"
        name twoBitCrossOver `shouldEqual` PieceId "two-bit-cross-over"
        name succPiece `shouldEqual` PieceId "succ"
        name (mkAdder OneBit) `shouldEqual` PieceId "adder-piece"
        name (mkMultiplier OneBit) `shouldEqual` PieceId "multiplier-piece"
        name (mkEqualPiece OneBit) `shouldEqual` PieceId "equal-piece"
        name (mkGreaterThanPiece OneBit) `shouldEqual` PieceId "greater-than-piece"
        name (mkLessThanPiece OneBit) `shouldEqual` PieceId "less-than-piece"
      it "ignores capacity" do
        name (mkWirePiece { capacity: EightBit, outputs: S.singleton Right }) `shouldEqual` name idPiece

    describe "reverseChickenPiece" do
      it "routes Left to Up and Right to Down" do
        let inputs = Frame.fromFoldable zero [ Tuple Left (mkSignal 1), Tuple Right (mkSignal 2) ]
        let outputs = eval reverseChickenPiece inputs
        Frame.index Up outputs `shouldEqual` mkSignal 1
        Frame.index Down outputs `shouldEqual` mkSignal 2

    describe "updateCapacity" do
      it "changes every port of a basic piece, on a side with a port" do
        map getPortCapacities (updateCapacity Left TwoBit notPiece)
          `shouldEqual` Just [ Tuple Right TwoBit, Tuple Left TwoBit ]
        updateCapacity Up TwoBit notPiece `shouldEqual` Nothing
      it "keeps the operation of a basic piece" do
        map (\(Piece p) -> p.op) (updateCapacity Left TwoBit andPiece) `shouldEqual` Just Operation.And
      it "rebuilds single wires as the same piece at the new capacity" do
        updateCapacity Left TwoBit superPiece `shouldEqual`
          Just (mkWirePiece { capacity: TwoBit, outputs: S.fromFoldable [ Up, Right, Down ] })
        updateCapacity Up TwoBit idPiece `shouldEqual` Nothing
      it "changes every port of a dual wire" do
        map getPortCapacities (updateCapacity Up FourBit crossPiece)
          `shouldEqual` Just (A.sort (map (\dir -> Tuple dir FourBit) [ Up, Right, Down, Left ]))
      it "rebuilds arithmetic pieces" do
        updateCapacity Left FourBit succPiece `shouldEqual` Just (mkSuccPiece FourBit)
        updateCapacity Left FourBit (mkAdder OneBit) `shouldEqual` Just (mkAdder FourBit)
      it "treats a multiplier's Right side as double its inputs" do
        updateCapacity Left TwoBit (mkMultiplier OneBit) `shouldEqual` Just (mkMultiplier TwoBit)
        updateCapacity Right FourBit (mkMultiplier OneBit) `shouldEqual` Just (mkMultiplier TwoBit)
        updateCapacity Down TwoBit (mkMultiplier OneBit) `shouldEqual` Nothing
      it "resizes fuse and sever from either side" do
        updateCapacity Up TwoBit fusePiece `shouldEqual` Just (mkFusePiece { inputCapacity: TwoBit })
        updateCapacity Right FourBit fusePiece `shouldEqual` Just (mkFusePiece { inputCapacity: TwoBit })
        updateCapacity Left TwoBit fusePiece `shouldEqual` Nothing
        updateCapacity Up OneBit fusePiece `shouldEqual` Nothing
        updateCapacity Up TwoBit severPiece `shouldEqual` Just (mkSeverPiece { outputCapacity: TwoBit })
        updateCapacity Left FourBit severPiece `shouldEqual` Just (mkSeverPiece { outputCapacity: TwoBit })
        updateCapacity Right TwoBit severPiece `shouldEqual` Nothing
      it "only changes a comparison from its input sides" do
        updateCapacity Up TwoBit (mkEqualPiece OneBit) `shouldEqual` Just (mkEqualPiece TwoBit)
        updateCapacity Right TwoBit (mkEqualPiece OneBit) `shouldEqual` Nothing
      it "never changes unary pieces" do
        updateCapacity Left TwoBit (mkShiftLeftBy 1 OneBit) `shouldEqual` Nothing

    describe "shouldRipple" do
      it "ripples through gates, wires, and fuse pieces" do
        map shouldRipple [ notPiece, idPiece, crossPiece, fusePiece, severPiece ]
          `shouldEqual` [ true, true, true, true, true ]
      it "stops at arithmetic, comparison and unary pieces" do
        map shouldRipple [ succPiece, mkAdder OneBit, mkMultiplier OneBit, mkEqualPiece OneBit, mkShiftLeftBy 1 OneBit ]
          `shouldEqual` [ false, false, false, false, false ]

    describe "complexity" do
      let spaceOf (Piece p) = complexity p.op
      it "charges a single wire per output, and a dual wire once" do
        spaceOf superPiece `shouldEqual` space 3.0
        spaceOf idPiece `shouldEqual` space 1.0
        spaceOf crossPiece `shouldEqual` space 1.0
      it "matches each family's cost" do
        spaceOf notPiece `shouldEqual` space 1.0
        spaceOf (mkAdder OneBit) `shouldEqual` space 10.0
        spaceOf (mkEqualPiece OneBit) `shouldEqual` space 0.0

    describe "adapt" do
      it "keeps a wire's capacity" do
        adapt Down (inputPort FourBit) (mkWirePiece { capacity: FourBit, outputs: S.singleton Right })
          `shouldEqual` mkWirePiece { capacity: FourBit, outputs: S.fromFoldable [ Right, Down ] }
      it "leaves everything but single wires unchanged" do
        for_ [ notPiece, crossPiece, chickenPiece, fusePiece, mkAdder OneBit ] \piece -> do
          adapt Up noPort piece `shouldEqual` piece
          adapt Down (inputPort OneBit) piece `shouldEqual` piece

-- | The capacity of each real port, by side.
getPortCapacities :: Piece -> Array (Tuple CardinalDirection Capacity)
getPortCapacities piece = A.sort do
  dir <- [ Up, Right, Down, Left ]
  let port = Frame.index dir (getPorts piece)
  guard (hasPort port)
  pure (Tuple dir (portCapacity port))

genSignals :: Gen (Frame Signal)
genSignals = arbitrary

equivalentTo :: Piece -> Piece -> Gen Result
equivalentTo p1 p2 = do
  inputs <- genSignals
  pure $ eval p1 inputs `assertEquals` eval p2 inputs

isLessAdaptedOrEqualTo :: Piece -> Piece -> Gen Result
isLessAdaptedOrEqualTo p1 p2 = do
  inputs <- truncateInputs p1 <$> genSignals
  let outs1 = eval p1 inputs
  let outs2 = eval p2 inputs
  -- only the sides `p1` actually writes: `outs1` is total, so it says
  -- nothing on the others
  let le = flip allWithIndex outs1 \dir signal ->
         not (isOutput (Frame.index dir (getPorts p1))) || signal == Frame.index dir outs2

  if le
    then pure $ Success
    else pure $ Failed $ show { p1, p2, inputs, outs1, outs2 }