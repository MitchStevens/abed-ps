module Component.TestRunner.Render where

import Component.TestRunner.Types
import Prelude

import Halogen (ComponentHTML)
import Halogen.HTML as HH

-- | TestRunner has nothing left to draw: the card (and now its buttons, see
-- | `cardContentFor`'s `actions`) is entirely CardStack's job, and CardStack
-- | is slotted directly into Sidebar rather than nested under TestRunner.
-- | A Halogen component still has to be *mounted* (via `HH.slot`/`slot_`) for
-- | its `eval` loop -- Initialize/Receive/handleQuery -- to run at all; it
-- | just doesn't have to render any DOM in return. This is that component.
render :: forall m. State -> ComponentHTML Action () m
render _ = HH.text ""
