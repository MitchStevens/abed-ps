module Test.Guide.Guide where

import Prelude

import Control.Monad.Reader (runReaderT)
import Data.Exists (Exists, mkExists)
import Data.Maybe (Maybe(..), maybe)
import Data.Nullable (Nullable, notNull, null, toMaybe)
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Effect.Ref as Ref
import Guide.Guide (GuideE(..), runGuideE, say)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldReturn)

foreign import addOne :: Effect Unit
foreign import getValue :: Effect Int

countTo3Guide :: GuideE Unit
countTo3Guide =
  { blocker: do
      n <- getValue
      pure $ if n < 3 then Just unit else Nothing
  , action: \(_ :: Unit) -> do
      liftEffect addOne
  }
    

foreign import getName :: Effect (Nullable String)
foreign import setName :: Effect Unit
setNameGuide :: GuideE Unit
setNameGuide =
  { blocker: maybe (Just unit) (\_ -> Nothing) <<< toMaybe <$> getName
  , action: \_ -> do
      liftEffect setName
  }

parentSetNameGuide :: GuideE Unit
parentSetNameGuide =
  { blocker: maybe (Just unit) (\_ -> Nothing) <<< toMaybe <$> getName
  , action: \_ -> runGuideE setNameGuide
  }



foreign import checkNumber :: Int -> Effect Boolean
foreign import isGreaterThanGoal :: Int -> Effect Boolean

guessTheNumberGuide :: Effect (GuideE Ordering)
guessTheNumberGuide = do
  min <- Ref.new 0
  max <- Ref.new 100
  let makeGuess = (\a b -> (a + b) `div` 2) <$> Ref.read min <*> Ref.read max
  pure
    { blocker: do
        guess <- liftEffect makeGuess
        isEqual <- checkNumber guess
        isGreater <- isGreaterThanGoal guess
        case isEqual, isGreater of
          true, _ -> pure Nothing
          false, true -> pure (Just GT)
          false, false -> pure (Just LT)
    , action: \ord -> do
        guess <- liftEffect makeGuess
        say ("guessing " <> show guess)
        case ord of
          LT -> liftEffect $ Ref.write guess min
          EQ -> liftEffect $ pure unit
          GT -> liftEffect $ Ref.write guess max
    }



spec :: Spec Unit
spec =
  describe "Guide.Guide" do
    it "count to 3 guide" do
      liftEffect getValue `shouldReturn` 0
      runReaderT (runGuideE countTo3Guide) log
      liftEffect getValue `shouldReturn` 3
    it "set name guide" do
      liftEffect getName `shouldReturn` null
      runReaderT (runGuideE parentSetNameGuide) log
      liftEffect getName `shouldReturn` (notNull "mitch")
    itOnly "guess the number" do
      guessTheNumber <- liftEffect guessTheNumberGuide
      runReaderT (runGuideE guessTheNumber) log


