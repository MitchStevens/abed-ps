module Guide.DOMNavigation where

import Prelude

import Component.DataAttribute (DataAttribute)
import Component.DataAttribute as DA
import Control.Monad.Except (ExceptT, lift, runExceptT, throwError)
import Data.Array as Array
import Data.Either (Either, either)
import Data.Maybe (Maybe(..), fromMaybe, maybe, maybe')
import Effect.Aff (Aff, error)
import Effect.Class (liftEffect)
import Effect.Class.Console (logShow)
import Partial.Unsafe (unsafeCrashWith)
import Web.DOM (Element)
import Web.DOM.Element as Element
import Web.DOM.Element as Web.DOM.Element
import Web.DOM.HTMLCollection as HTMLCollection
import Web.DOM.NonElementParentNode as Web.DOM.NonElementParentNode
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML.Common (ClassName(..))

selectionNotFound :: forall a. QuerySelector -> Aff a
selectionNotFound (QuerySelector selector) = throwError $ error ("Selection not found: " <> selector)

getElementByQuerySelector :: QuerySelector -> Element -> Aff Element
getElementByQuerySelector selector element =
  getElementByQuerySelectorMaybe selector element >>=
    maybe' (\_ -> selectionNotFound selector) pure

getElementByQuerySelectorMaybe :: QuerySelector -> Element -> Aff (Maybe Element)
getElementByQuerySelectorMaybe selector element = liftEffect $
  querySelector selector (Element.toParentNode element)

getElementByClassName :: ClassName -> Element -> Aff Element
getElementByClassName (ClassName className) element = 
  getElementByQuerySelector (QuerySelector ("." <> className)) element

getElementByClassNameMaybe :: ClassName -> Element -> Aff (Maybe Element)
getElementByClassNameMaybe (ClassName className) element =
  getElementByQuerySelectorMaybe (QuerySelector ("." <> className)) element

getElementById :: String -> Element -> Aff Element
getElementById id element = 
  getElementByQuerySelector (QuerySelector ("#" <> id)) element

getElementByDataAttribute :: forall a. DataAttribute a -> a -> Element -> Aff Element
getElementByDataAttribute attr a element = 
  getElementByQuerySelector (DA.selector attr a) element