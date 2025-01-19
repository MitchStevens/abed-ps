module Game.Level.LevelValidator where

import Prelude

import Control.Monad.Writer (execWriter)
import Data.Array as A
import Data.Either (Either(..))
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Game.Board (Board(..), RelativeEdge, PieceInfo, allLocations)
import Game.Location (Location)
import Game.Piece (Piece)

type FailedValidation = { description :: String, locations :: Array Location }

type LevelValidator = Either FailedValidation Unit

validatePieces :: String -> (Piece -> Boolean) -> Board -> LevelValidator
validatePieces description pred = 
  validateLocations description (\_ -> maybe true (\p -> pred p.piece))

validateLocations :: String -> (Location -> Maybe PieceInfo -> Boolean) -> Board -> LevelValidator
validateLocations description pred board@(Board { pieces, size }) = do
  let locations = L.filter (\loc -> pred loc (M.lookup loc pieces)) $ allLocations board
  when (not (L.null locations)) do
    Left { description, locations: A.fromFoldable locations }



--validateEvaluation :: String -> () Board -> LevelValidator
--
--String -> (RelativeEdge -> PortInfo -> Boolean) -> Board -> LevelValidator

--change name maybe?
--invalidateLocations :: Array Location -> Board -> LevelValidator
--invalidateLocations locations (Board {pieces, size}) = do
--  let badLocations = A.fromFoldable $ S.fromFoldable locations `S.intersection` M.keys pieces
--  case A.uncons badLocations of
--    Nothing -> pure unit
--    Just { head, tail: [] } -> 
--      let description = "Remove piece at " <> show head
--      in Left { description, locations: A.fromFoldable badLocations } 
--    Just { head, tail } -> 
--      let description = "Remove pieces at " <> A.intercalate ", " (map show badLocations)
--      in Left { description, locations: A.fromFoldable badLocations } 