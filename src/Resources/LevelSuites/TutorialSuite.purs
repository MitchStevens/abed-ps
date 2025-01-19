module Resources.LevelSuites.TutorialSuite (tutorialSuite )where

import Prelude

import Data.Array (elem)
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.UInt as UInt
import Game.Direction as Direction
import Game.Level (Level, LevelOptions, LevelSuite, binaryTestInputs, defaultLevel, toLevelSuite)
import Game.Level.Demonstration (videoDemonstration)
import Game.Level.LevelValidator (validatePieces)
import Game.Piece (andPiece, chickenPiece, constPiece, idPiece, leftPiece, name, notPiece, orPiece)
import Game.Signal as Base


tutorialSuite :: LevelSuite
tutorialSuite = toLevelSuite
  [ identityLevel
  , notLevel
  , orLevel
  , leftLevel
  , chickenLevel
  , alwaysOnLevel
  ]
  where
    identityLevel :: Level
    identityLevel = defaultLevel
      { goal = idPiece
      , title = "From A to B"
      , subtitle = Just "As easy as... "
      , description = "The input on the left needs to be connected to the output on the right. Use the 'demonstrate' button for a quick tutorial."
      , demonstration = Just $ videoDemonstration
        { title: "Creating pieces"
        , videoUrl: "./static/images/demonstrations/new_path.mp4"
        , description: "To create a Piece, click and drag from the left to the right"
        }
      , testCases = binaryTestInputs [ Direction.Left ]
      , availablePieces = S.fromFoldable [ ]
      , options = options
      }

    notLevel :: Level
    notLevel = defaultLevel
      { goal = notPiece
      , title = "Negation"
      , subtitle = Just "Not bad"
      , description = "Negate the signal inputed on the Left and output it on the Right. You can add a piece to the board from the \'Available Pieces\' menu by clicking an icon or dragging an icon an open location."
      , demonstration = Just $ videoDemonstration
        { title: "Moving pieces"
        , videoUrl: "./static/images/demonstrations/move_piece.mp4"
        , description: "To move a piece, click and drag the piece to another location"
        }
      , testCases = binaryTestInputs [Direction.Left]
      , availablePieces = S.fromFoldable [ notPiece ]
      , options = options
      }
    
    orLevel :: Level
    orLevel = defaultLevel
      { goal = orPiece
      , title = "Two enter, one leaves"
      , subtitle = Just "The gladiator (2000)"
      , description = "The output on the left should be on when at least one of the inputs are on."
      , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
      , availablePieces = S.fromFoldable [ orPiece ]
      , options = options
      }
    
    leftLevel :: Level
    leftLevel = defaultLevel
      { goal = leftPiece
      , title = "Take a Left"
      , subtitle = Just "Taking L(efts)s"
      , description = "Propagate the signal on the left to the top. Use only the straight and or pieces!"
      , testCases = binaryTestInputs [Direction.Left]
      , availablePieces = S.fromFoldable [ idPiece, orPiece ]
      , validate = validatePieces "You can only use the straight and or pieces!" (\piece -> name piece `elem` [ name idPiece, name orPiece ])
      , options = options
      }
    
    chickenLevel :: Level
    chickenLevel = defaultLevel
      { goal = chickenPiece
      , title = "The Chicken"
      , subtitle = Just "It’s electrifyin’!"
      , description = "Like two cars swerving avay at the last minute, your signals would also prefer not to crash into each other. The left signal swerves down and the right signal swerves up."
      , testCases = binaryTestInputs [Direction.Left, Direction.Right]
      , availablePieces = S.fromFoldable [ ]
      , options = options
      }

    alwaysOnLevel :: Level
    alwaysOnLevel = defaultLevel
      { goal = constPiece (UInt.complement zero)
      , title = "Always on"
      , subtitle = Just "A Hanukkah miracle"
      , description = "Regardless of the input on the left, the output on the right should always be on. Don't let the flame go out!"
      , testCases = binaryTestInputs [ Direction.Left ]
      , availablePieces = S.fromFoldable [ notPiece, orPiece, andPiece  ]
      , options = options
      }
    
    fullSendLevel :: Level
    fullSendLevel = defaultLevel
      { goal = idPiece
      , title = "No vacancies!"
      , description = ""
      , testCases = binaryTestInputs [ Direction.Left ]
      }

    options :: LevelOptions
    options =
      { enableBoardSizeChange: false
      , compulsory: true
      , base: Base.Binary
      }
  