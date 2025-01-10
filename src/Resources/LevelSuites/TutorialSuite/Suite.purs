module Resources.LevelSuites.TutorialSuite.Suite where

import Prelude

import Capability.Navigate (Route(..))
import Component.Marginalia.Types (description, marginalia)
import Control.Monad.Reader (ask, lift)
import Control.Plus ((<|>))
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Functor.Joker (Joker)
import Data.FunctorWithIndex (mapWithIndex)
import Data.HeytingAlgebra (ff, tt)
import Data.Maybe (Maybe(..))
import Data.MediaType (MediaType(..))
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Direction as Direction
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Level.Demonstration (videoDemonstration)
import Game.Level.Problem (defaultProblem)
import Game.Location (location)
import Game.Message (Conversation, Message(..), button, guideMessage, noUser, sendMessage)
import Game.Piece (chickenPiece, cornerCutPiece, idPiece, leftPiece, notPiece, orPiece)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Test.Game.Level.Problem (problemDescription)

tutorialSuite :: LevelSuite
tutorialSuite = fromHomogeneous
  { "From A to B":
    defaultLevel
      { problem = defaultProblem
        { goal = idPiece
        , title = "From A to B"
        , subtitle = Just "As easy as... "
        , description = "The input on the left needs to be connected to the output on the right. Use the 'demonstrate' button for a quick tutorial."
        , demonstration = Just $ videoDemonstration
          { title: "Creating pieces"
          , videoUrl: "./images/demonstrations/new_path.mp4"
          , description: "To create a Piece, click and drag from the left to the right"
          }
        , testCases = binaryTestInputs [ Direction.Left ]
        , availablePieces = S.fromFoldable [ ]
        }
      }
  , "Negation":
    defaultLevel
      { problem = defaultProblem
        { goal = notPiece
        , title = "Negation"
        , subtitle = Just "Not bad"
        , description = "Negate the signal inputed on the Left and output it on the Right. You can add a piece to the board from the \'Available Pieces\' menu by clicking an icon or dragging an icon an open location."
        , testCases = binaryTestInputs [Direction.Left]
        , availablePieces = S.fromFoldable [ notPiece ]
        }
      }
  , "Two enter, one leaves": defaultLevel
    { problem = defaultProblem
      { goal = orPiece
      , title = "Two enter, one leaves"
      , subtitle = Just "The gladiator (2000)"
      , description = "An or piece takes two inputs!"
      , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
      , availablePieces = S.fromFoldable [ orPiece ]
      }
    }
  , "Take a Left": defaultLevel
    { problem = defaultProblem
      { goal = leftPiece
      , title = "Take a Left"
      , subtitle = Just "Taking L(efts)s  "
      , description = ""
      , testCases = binaryTestInputs [Direction.Left]
      , availablePieces = S.fromFoldable [ orPiece ]
      }
    }
  , "The Chicken": defaultLevel
    { problem = defaultProblem
      { goal = chickenPiece
      , title = "The Chicken"
      , subtitle = Just "Huh McFly!"
      , description = ""
      , testCases = binaryTestInputs [Direction.Left, Direction.Right]
      , availablePieces = S.fromFoldable [ ]
      }
    }
  }
  
  