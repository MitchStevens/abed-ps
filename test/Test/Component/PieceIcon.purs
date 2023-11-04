module Test.Component.PieceIcon where

import Prelude

import Component.Piece.PieceIcon (icons)
import Data.Array as A
import Data.Foldable (for_)
import Data.Map as M
import Data.Maybe (maybe)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Halogen (Component, defaultEval, lift, liftEffect, mkComponent, mkEval)
import Halogen.Aff (awaitLoad, selectElement)
import Halogen.HTML as HH
import Halogen.VDom.Driver (runUI)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.HTMLElement (title)

main :: Effect Unit
main = launchAff_ do
  awaitLoad
  mbDivElem <- selectElement $ QuerySelector "#abed"
  log "hello"
  maybe (log "nothing") (\e -> liftEffect (title e >>= log)) mbDivElem
  for_ mbDivElem (runUI component unit)

component :: forall q i o m. Component q i o m
component = mkComponent { render, eval: mkEval defaultEval, initialState: \_ -> unit }
  where
    render _ = HH.div_ $  A.fromFoldable icons <#> \html -> html

