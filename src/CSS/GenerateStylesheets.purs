module CSS.GenerateStylesheets where

import Prelude

import CSS.Board (boardComponent, boardStyleSheet)
import Effect (Effect)
import Effect.Class.Console (log)
import Tecton (pretty, renderSheet)

main :: Effect Unit
main = do
  log $ renderSheet pretty do
    boardStyleSheet