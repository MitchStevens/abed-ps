module Resources.LevelSuites.TutorialSuite.Suite where

import Prelude

import Component.DataAttribute as DA
import Control.Monad.Reader (ask, lift)
import Control.Plus ((<|>))
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens ((.~))
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Time.Duration (Milliseconds(..))
import Effect.Aff (delay, parallel, sequential)
import Effect.Aff.Class (liftAff)
import Effect.Aff.Compat (fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Foreign.Object (fromHomogeneous)
import Game.Direction as Direction
import Game.GameEvent (count, firstTime, latest, pieceAdded, pieceMovedTo, secondTime)
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Level.Problem (defaultProblem)
import Game.Level.RulesEngine (Rule(..))
import Game.Location (location)
import Game.Message (Message(..), button, guideMessage, noUser, sendMessage)
import Game.Piece (idPiece, leftPiece, name, notPiece, orPiece)
import Guide.Overlay (addPieceOverlay)
import Halogen.HTML as HH
import Halogen.Subscription as HS

--import Resources.LevelSuites.TutorialSuites.Guide (firstLevelGuide)

tutorialSuite :: LevelSuite
tutorialSuite = fromHomogeneous
  { "From A to B":
    defaultLevel
      { problem = defaultProblem
        { goal = idPiece
        , title = "From A to B"
        , description = "Propagate the signal inputed on the Left to the Right"
        , testCases = binaryTestInputs [ Direction.Left ]
        , availablePieces = [ idPiece ]
        }
      , conversation = do
         -- guideMessage "hey. guide here"
         -- guideMessage "you look a little green? have you played this game before?"
          playedBefore <- sendMessage $ button "yes" "Y" true <|> (noUser (HH.text "/") *> button "no" "N" false)
          listener <- ask 
          let say str = HS.notify listener {user: Just "guide", html: [ HH.text str ] }
          guideMessage "alright lets get going"
          liftAff $ addPieceOverlay (name idPiece)
          pure unit



          --liftEffect $ runGuide firstLevelGuide say
          --liftAff $ runGuide guideSays firstLevelGuide
          --if not playedBefore
          --  then do
          --    guideMessage "ok, lets get going"
          --    liftAff (fromEffectFnAff addPieceGuide)
          --    guideMessage "yep thats how you do it"
          --    liftAff (fromEffectFnAff movePieceGuide)
          --    guideMessage "looks good...ish"
          --    guideMessage "but there's still that hole in the center???"
          --    liftAff (fromEffectFnAff runTestsGuide)
          --    guideMessage "alrighty, first level complete!"
          --    guideMessage "hit 'Back to Level Select' if you enjoyed it"
          --    guideMessage "otherwise hit Ctrl+W to do something else. we're not starved for distraction in the internet age"
          --  else do
          --    guideMessage "ok all g"
          --    guideMessage "ill leave you to it :)"
      }
  , "Negation":
    defaultLevel
      { problem =
        { goal: notPiece
        , title: "Negation"
        , description: "Negate the signal inputed on the Left and output it on the Right"
        , testCases: binaryTestInputs [Direction.Left]
        , requiresAutomaticTesting: false
        , availablePieces: [ idPiece, notPiece ]
        , otherRestrictions: []
        }
      , conversation = do
          sendMessage $ Message
            { user: Just "mitch"
            , html: [ HH.text "hello world" ]
            , action: pure unit
            }
          n <- sendMessage $ button "" "click me" 47
          log ("got: " <> show n)
      }
  , "Two enter, one leaves": defaultLevel
    { problem = defaultProblem
      { goal = orPiece
      , title = "Two enter, one leaves"
      , description = ""
      , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
      , availablePieces = [ idPiece, orPiece ]
      }
    }
  , "Take a Left": defaultLevel
    { problem = defaultProblem
      { goal = leftPiece
      , title = "Take a Left"
      , description = ""
      , testCases = binaryTestInputs [Direction.Left]
      , availablePieces = [ idPiece, orPiece ]
      }
    }
  }
  
  