module Test.Game.Piece.WirePiece where

import Prelude

import Control.Monad.Trans.Class (lift)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece (Capacity(..), Port(..), PortType(..), getCapacity, getPorts, idPiece, inputPort, outputPort, updateCapacity, updatePort)
import Test.Unit (TestSuite, describe, failure, it)
import Test.Unit.AssertExtra (assertNothing, shouldEqual)

tests :: TestSuite
tests =
  describe "idPiece" do
    it "capacity" do
      getCapacity idPiece `shouldEqual` Just OneBit
      (getCapacity =<< updateCapacity TwoBit idPiece) `shouldEqual` Just TwoBit
      (getCapacity =<< updateCapacity FourBit idPiece) `shouldEqual` Just FourBit
      (getCapacity =<< updateCapacity EightBit idPiece) `shouldEqual` Just EightBit
    it "ports" $ do
      getPorts idPiece `shouldEqual` M.fromFoldable
        [ Tuple Direction.Left (inputPort OneBit)
        , Tuple Direction.Right (outputPort OneBit) ]
      assertNothing (updatePort Direction.Left Nothing idPiece)
      assertNothing (updatePort Direction.Left (Just Input) idPiece)

      assertNothing (updatePort Direction.Up Nothing idPiece)

      case updatePort Direction.Up (Just Input) idPiece of
       Just p' -> getPorts p' `shouldEqual`
         M.fromFoldable
           [ Tuple Direction.Left (inputPort OneBit)
           , Tuple Direction.Up (inputPort OneBit)
           , Tuple Direction.Right (outputPort OneBit) ]
       Nothing -> failure "shouldn't be nothing"
      



