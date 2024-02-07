module Resources.LevelSuites.TutorialSuites.Guide where

import Prelude

import Control.Monad.Cont (class MonadCont, callCC, lift, runContT)
import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.Rec.Class (class MonadRec, untilJust)
import Control.Monad.Writer (tell)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Game.Location (location)
import Game.Piece (idPiece)
import Guide.Guide (GuideM)

foreign import addIdPieceLesson :: Effect Unit
foreign import movePieceToLeftLesson :: Effect Unit

{-
add and move id piece
move left piece
rotate left piece
add id piece
move right piece
rotate left piece
-}


  --[ conditionalAction (pieceAtEquals (location 0 0) idPiece) do
  --    tell "lesson uno: adding pieces to the board"
  --    liftEffect addIdPieceLesson
  --, conditionalAction (pieceAtEquals (location 0 0) idPiece && noPieceAt (location 0 1)) do
  --    tell "Now lets trying moving the piece into position"
  --    liftEffect movePieceToLeftLesson
  --]