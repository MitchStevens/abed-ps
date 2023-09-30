module Test.Component.Main where

import Prelude

import Component.Board as Board
import Component.Chat as Chat
import Component.Piece as Piece
import Component.Puzzle as Puzzle
import Data.Foldable (for_)
import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, runAff_)
import Effect.Class.Console (log)
import Effect.Exception (throw)
import Game.Location (location)
import Game.Location as Direction
import Game.Piece (mkPiece)
import Game.Piece.BasicPiece (andPiece, idPiece, notPiece, orPiece)
import Game.ProblemDescription (restrictionPieceCount)
import Halogen (Component, HalogenIO, liftEffect)
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)
import IO.Conversations (conversation2)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML (HTMLElement, window)
import Web.HTML.HTMLDocument (toDocument, toEventTarget)
import Web.HTML.Window (document)
import Web.UIEvent.KeyboardEvent as KeyboardEvent
import Web.UIEvent.KeyboardEvent.EventTypes (keydown)

  --[ Tuple "" $ proxy ExpIndex.component -- override the index page
  --, Tuple "count" $ proxy ExpCount.component
  --, Tuple "input" $ proxy ExpInput.component
  --]

main :: Effect Unit
main = testPuzzleComponent
    
runComponent :: forall query input output. input -> Component query input output Aff -> Aff (HalogenIO query output Aff)
runComponent input component = do
  HA.awaitLoad
  (element :: HTMLElement ) <- HA.selectElement (QuerySelector "#abed") >>=
    maybe (throw ("Could not find element #abed")) pure >>> liftEffect
  runUI component input element

testChatComponent ::  Effect Unit
testChatComponent = HA.runHalogenAff do
  { dispose, messages, query } <- runComponent unit Chat.component
  _ <- query (Chat.QueuedMessages conversation2)
  pure unit

testPuzzleComponent :: Effect Unit
testPuzzleComponent = HA.runHalogenAff do
  let conversation = conversation2
      problemDescription = problem2
  { dispose, messages, query } <- runComponent { problemDescription, conversation } Puzzle.component
  -- intialise keyboard event  listener for C-z: undo
  liftEffect $ do
    htmlDocument <- window >>= document
    let target = toEventTarget htmlDocument
    listener <- eventListener $ \event -> do
      for_ (KeyboardEvent.fromEvent event) \ke ->
        runAff_ (\_ -> pure  unit) $ query (Puzzle.GlobalKeyDown ke unit)
    addEventListener keydown listener true target
  pure unit

problem1 =
  { goal: mkPiece idPiece
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

problem2 = 
  { goal: mkPiece orPiece
  , title: "or problem"
  , description: "create or from and an not"
  , testCases: [ testCase ff ff, testCase ff tt, testCase tt tt ]
  , requiresAutomaticTesting: false
  , pieceSet: S.fromFoldable [ mkPiece notPiece, mkPiece andPiece, mkPiece idPiece ]
  , otherRestrictions: []
  }
  where
    testCase x y = M.fromFoldable [ Tuple Direction.Up x, Tuple Direction.Left y ]
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
testPieceComponent :: Effect Unit
testPieceComponent = void $ HA.runHalogenAff do
  runComponent { location: location 0 0, piece: mkPiece notPiece } Piece.component