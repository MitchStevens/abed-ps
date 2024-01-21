module Component.Lesson.Condition where

import Prelude

import Data.Foldable (elem)
import Data.Maybe (isJust, isNothing)
import Data.Nullable (Nullable, toMaybe)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Tuple (Tuple)
import Data.Typelevel.Num (class Nat, toInt, toInt')
import Effect (Effect)
import Game.Level.Completion (CompletionStatus)
import Type.Proxy (Proxy(..))
import Web.DOM (Element)

data Condition

foreign import data BoardIsEmpty :: Condition
foreign import data ExistsPieceAt :: Type -> Type -> Condition
foreign import data NoPieceAt :: Type -> Type -> Condition
foreign import data CompletionStatusEquals :: Symbol -> Condition

class Verify :: Condition -> Constraint
class Verify condition where
  verifyCondition :: Effect Boolean

instance Verify BoardIsEmpty where
  verifyCondition = boardIsEmpty

instance (Nat x, Nat y) => Verify (ExistsPieceAt x y) where
  verifyCondition = do 
    element <- pieceAt (toInt' (Proxy :: Proxy x)) (toInt' (Proxy :: Proxy y))
    pure $ isJust (toMaybe element)

instance (Nat x, Nat y) => Verify (NoPieceAt x y) where
  verifyCondition = do 
    element <- pieceAt (toInt' (Proxy :: Proxy x)) (toInt' (Proxy :: Proxy y))
    pure $ isNothing (toMaybe element)

instance IsSymbol symbol => Verify (CompletionStatusEquals symbol) where
  verifyCondition = do
    status <- toMaybe <$> completionStatus 
    pure $ (reflectSymbol (Proxy :: Proxy symbol)) `elem` status

foreign import boardIsEmpty  :: Effect Boolean

foreign import pieceAt :: Int -> Int -> Effect (Nullable Element)

foreign import completionStatus :: Effect (Nullable String)

