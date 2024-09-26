module Web.UIEvent.MouseEvent.Extras where

import Prelude

import Control.Alternative (guard)
import Data.Compactable (compact)
import Data.Generic.Rep (class Generic)
import Data.Int.Bits as Bits
import Data.Set (Set)
import Data.Set as S
import Data.Show.Generic (genericShow)
import Partial.Unsafe (unsafeCrashWith)
import Web.UIEvent.MouseEvent (MouseEvent)
import Web.UIEvent.MouseEvent as MouseEvent

data MouseButton = Primary | Secondary | Auxiliary | Button4 | Button5
derive instance Generic MouseButton _
derive instance Eq MouseButton
derive instance Ord MouseButton
instance Show MouseButton where
  show = genericShow

button :: MouseEvent -> MouseButton 
button me = case MouseEvent.button me of
  0 -> Primary
  1 -> Auxiliary
  2 -> Secondary
  3 -> Button4
  4 -> Button5
  n -> unsafeCrashWith ("No such button " <> show n)

buttons :: MouseEvent -> Set MouseButton
buttons me = S.fromFoldable $ compact
  [ guard (nthBitHigh 0) $> Primary
  , guard (nthBitHigh 1) $> Secondary
  , guard (nthBitHigh 2) $> Auxiliary
  , guard (nthBitHigh 3) $> Button4
  , guard (nthBitHigh 4) $> Button5
  ]
  where
    n = MouseEvent.buttons me
    nthBitHigh bit = Bits.and n (Bits.shr 1 bit) > 0

 

--whenButton :: forall m a. MouseEvent -> MouseButton -> m a -> m Unit
--whenButton me button action = 
--  when (S.member button (buttons me)) action
