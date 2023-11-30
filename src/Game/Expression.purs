module Game.Expression where

import Prelude

import Data.Array (fold, zip, zipWith)
import Data.Array.NonEmpty (all)
import Data.Enum (enumFromThenTo, enumFromTo)
import Data.Foldable (class Foldable, and)
import Data.Function (on)
import Data.HeytingAlgebra (ff, tt)
import Data.Int.Bits (xor)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Profunctor.Strong ((***))
import Data.String.CodeUnits (fromCharArray)
import Data.Traversable (class Traversable)
import Data.Tuple (Tuple(..))
import Data.Unfoldable (unfoldr)
import Game.Direction (CardinalDirection)
import Game.Signal (Signal(..))

data Expression
  = Raw Signal
  | Ref CardinalDirection
  | Not Expression
  | Or Expression Expression
  | And Expression Expression
  | Xor Expression Expression
derive instance Eq Expression

instance Show Expression where
  show = case _ of 
    Raw signal -> show signal
    Ref ref -> "ref: " <> show ref
    Not expr -> "~("<> show expr <> ")"
    Or  expr1 expr2 -> "(" <> show expr1 <> ")&(" <> show expr2 <> ")"
    And expr1 expr2 -> "(" <> show expr1 <> ")|(" <> show expr2 <> ")"
    Xor expr1 expr2 -> "(" <> show expr1 <> ")^(" <> show expr2 <> ")"

instance HeytingAlgebra Expression where
  ff = Raw ff
  tt = Raw tt
  not = Not
  implies a b = Or (Not a) b
  disj = Or
  conj = And


raw :: Int -> Expression
raw s = Raw (Signal s)

ref :: CardinalDirection -> Expression
ref = Ref

simplify :: Expression -> Expression
simplify exp = case exp of
  Raw signal -> Raw signal
  Ref ref -> Ref ref
  Not (Raw s) -> Raw (not s)
  Not (Not e) -> e
  Not e -> Not (simplify e)
  Or (Raw a) (Raw b) -> Raw (a || b)
  Or (Raw (Signal 0)) b -> simplify b
  Or a (Raw (Signal 0)) -> simplify a
  Or (Raw (Signal (-1))) _ -> Raw tt
  Or _ (Raw (Signal (-1))) -> Raw tt
  Or e1 e2 -> Or (simplify e1) (simplify e2)
  And (Raw a) (Raw b) -> Raw (a && b)
  And (Raw (Signal 0)) _ -> Raw ff
  And _ (Raw (Signal 0)) -> Raw ff
  And (Raw (Signal (-1))) b -> simplify b
  And a (Raw (Signal (-1))) -> simplify a
  And e1 e2 -> And (simplify e1) (simplify e2)
  _ -> exp

-- law: evaluate inputs (simplify expr) = evaluate inputs expr
evaluate :: (Map CardinalDirection Signal) -> Expression -> Signal
evaluate m = go where 
  go = case _ of
    Raw signal -> signal
    Ref ref -> fromMaybe ff (M.lookup ref m)
    Not expr -> not (go expr)
    Or  expr1 expr2 -> disj (go expr1) (go expr2)
    And expr1 expr2 -> conj (go expr1) (go expr2)
    Xor expr1 expr2 -> case go expr1, go expr2 of
      Signal a, Signal b -> Signal (xor a b)