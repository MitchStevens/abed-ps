module Resources.LevelSuites.IntermediateSuite where

import Prelude

import Component.DataAttribute as DataAttr
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Direction as Direction
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Level.Problem (defaultProblem)
import Game.Piece (andPiece, crossPiece, idPiece, leftPiece, name, notPiece, orPiece, rightPiece, superPiece, xorPiece)

intermediateSuite :: LevelSuite
intermediateSuite = fromHomogeneous
  { "Criss cross":
    defaultLevel
      { problem = defaultProblem
        { goal = crossPiece
        , title = "Cross over"
        , description = "Propogate the signal on the left to the right, and the top to the bottom"
        , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
        , availablePieces = S.fromFoldable [idPiece, superPiece, leftPiece, rightPiece, xorPiece]
        }
      --, boardDeltaRulesEngine = []
      --  --let l1 = location 2 1
      --  --    l2 = location 0 1
      --  --    l3 = location 1 1
      --  --in
      --  --  [ Rule (firstTime pieceAdded) $
      --  --    guiding "move this piece to location (2,1)" $
      --  --      selector DataAttr.location l1
      --  --  , Rule (firstTime (pieceMovedTo l1)) $
      --  --    guiding "add another piece" $
      --  --      selector DataAttr.availablePiece (name idPiece)
      --  --  , Rule (secondTime pieceAdded) $
      --  --    guiding "move piece to (0, 1)" $
      --  --      selector DataAttr.location l2
      --  --  , Rule (firstTime (pieceMovedTo l2)) $
      --  --    guiding "add one more final id piece" $
      --  --      selector DataAttr.availablePiece (name idPiece)
      --  --  , Rule ((count eq 3 && latest) pieceAdded) $
      --  --    guiding "move piece to (1, 1)" $
      --  --      selector DataAttr.location l3
      --  --  ]
      --, conversation = addDelay <$>
      --  [ message "test" "criss cross" ]
      }
    , "From Or, birthed And": defaultLevel
      { problem = defaultProblem
        { goal = andPiece
        , title ="From Or, birthed And"
        , description = "Create an and-piece using only or-piece and not-piece"
        , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
        , availablePieces = S.fromFoldable[ orPiece, notPiece ]
        } 
      }
    , "Exclusive Or: Pick One": defaultLevel
      { problem = defaultProblem
        { goal = xorPiece
        , title = "Exclusive Or: Pick One"
        , description = "Output true when EXACTLY one input is true. If both inputs are true, output false"
        , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
        , availablePieces = S.fromFoldable [ idPiece, notPiece, orPiece, andPiece, crossPiece ]
        }
      }
    }