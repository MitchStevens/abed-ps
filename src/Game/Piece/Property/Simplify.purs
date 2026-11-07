module Game.Piece.Property.Simplify
  ( Simplification(..)
  , isSimplifiable
  ) where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Show.Generic (genericShow)
import Game.Direction (CardinalDirection)
import Game.Frame (Frame)
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..))
import Game.Signal (Signal)

{-
  This "Simplification" data type is kinda confusing

  A `Simplification` is a short hand way of describing *some* simple pieces. These simplifications are used when compiling an `EvaluableBoard` into a more effecient `CompiledBoard`. Simplifications come in two forms:
  
  - If a piece can be simplified to `Constant`, the outputs of the  


  An obvious question: why not define `Simplification`:
  ```
  type Simplification = Map CardinalDirection (Either CardinalDirection Signal)
  ```
  Which would allow for the simplification of pieces that are a combination of `Constant` and `Connection`?

    1. Such a piece would be rare and not worth the additional complexity, and
    2. It's useful for creating paths (See `PathSegment.purs`)
-}
data Simplification
  = Constant (Frame Signal)
  | Connection (Map CardinalDirection CardinalDirection)
derive instance Generic Simplification _
derive instance Eq Simplification
instance Show Simplification where
  show = genericShow

{-
  To effeciently compile a board, we need to know whether a piece can be simplified.

    - constant pieces don't have to be evaluated, their values can be added to the initial signal map during compilation
    - connection pieces don't have to be evaluated either, their functionality can be added to the connection map during compilation
-}
isSimplifiable :: Piece -> Maybe Simplification
isSimplifiable (Piece p) = case p.op of
  Operation.Connection connections -> Just (Connection connections)
  _ -> Nothing
