module Main where

import Prelude

import Component.Board as Board
import Component.Chat as Chat
import Component.Piece as Piece
import Component.Puzzle as Puzzle
import Control.Monad.Error.Class (throwError)
import Data.Either (either, fromRight)
import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Data.Time.Duration (Seconds(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (error, throw)
import Game.Location as Direction
import Game.Piece (mkPiece)
import Game.Piece.BasicPiece (idPiece, notPiece)
import Game.ProblemDescription (restrictionPieceCount)
import Halogen (Component, HalogenIO)
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.VDom.Driver (runUI)
import IO.Conversations (conversation1, conversation2)
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML (HTMLElement)

main :: Effect Unit
main = testPuzzleComponent
--main = testBoardComponent
--
runComponent :: forall query input output. input -> Component query input output Aff -> Aff (HalogenIO query output Aff)
runComponent input component = do
  HA.awaitLoad
  (element :: HTMLElement ) <- HA.selectElement (QuerySelector "#abed") >>=
    maybe (throw ("Could not find element #abed")) pure >>> liftEffect
  runUI component input element

testChatComponent ::  Effect Unit
testChatComponent = HA.runHalogenAff do
  { dispose, messages, query } <- runComponent unit Chat.component
  --_ <- query (Chat.QueuedMessages
  --  [ { user: "mitch", text: "wow i'm alive", delayBy: Seconds 0.0 }
  --  , { user: "lachy", text: "i think i'm cool", delayBy: Seconds 1.0 }
  --  , { user: "mitch", text: "you are wrong", delayBy: Seconds 2.0 }
  --  , { user: "lachy", text: "ok goodbye", delayBy: Seconds 2.0 }
  --  ])
  _ <- query (Chat.QueuedMessages conversation2)
  pure unit

testPuzzleComponent :: Effect Unit
testPuzzleComponent = HA.runHalogenAff do
  let problemDescription = { goal: mkPiece idPiece
    , title: "Double negation"
    , description: "create an idenity from not gate"
    , testCases: [ M.singleton Direction.Left ff, M.singleton Direction.Left tt ]
    , requiresAutomaticTesting: false
    , pieceSet: S.fromFoldable [ mkPiece idPiece, mkPiece notPiece]
    , otherRestrictions:
      [ { name: "only one id",
          description: "only one id in t board is allowed", 
          restriction: restrictionPieceCount (Tuple 0 1) idPiece
        }
      ]
    }
  let conversation = conversation2
  { dispose, messages, query } <- runComponent { problemDescription, conversation } Puzzle.component
  pure unit

--
--
--testBoardComponent :: Effect Unit
--testBoardComponent = void $ HA.runHalogenAff do
--  board <- either (\err -> throwError (error (show err))) pure $
--    emptyBoard 3
--      >>= addPiece (location 1 1) Primitive.and
--      >>= addPiece (location 1 0) Primitive.not
--      >>= rotatePieceBy (location 1 0) (rotation 1)
--      >>= addPiece (location 0 1) Primitive.not
--      >>= addPiece (location 2 1) Primitive.not
--  runComponent { board } Board.component
--
--testPieceComponent :: Effect Unit
--testPieceComponent = void $ HA.runHalogenAff do
--  runComponent { piece: Primitive.and, name: "AND", location: location 0 0 } Piece.component