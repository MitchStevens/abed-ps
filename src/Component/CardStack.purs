module Component.CardStack where

import Prelude

import Data.DateTime.Instant (Instant, diff)
import Data.Int (toNumber)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Number (floor, sin)
import Data.Time.Duration (Milliseconds(..))
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Effect.Class (class MonadEffect)
import Effect.Now (now)
import Halogen (AttrName(..), ClassName(..), ComponentHTML, defaultEval, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Elements.Keyed as HK
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))

-- | Purely presentational: drives the status pill's colour only. The pill's
-- | text is caller-supplied, since what counts as "success" or "failure"
-- | reads differently for a test result than for, say, an achievement card.
data CardStatus
  = Pending
  | Active
  | Success
  | Failure

derive instance Eq CardStatus

type CardContent =
  { title :: String
  , statusBar :: Maybe { status :: CardStatus, text :: String }
  , text :: Array String
  }

-- | The permanent occupant of the slot. Because `State.cards` is a `Zipper`
-- | (never empty), this is what it's seeded with, and what's left showing
-- | once every real card has been stepped past -- there's no separate
-- | "nothing to show" branch, just a card that happens to render as an
-- | indentation (see `render`'s `card-empty` class).
emptyCard :: CardContent
emptyCard = { title: "", statusBar: Nothing, text: [] }

type Input = Unit

-- | Cards live in a zipper so we can flip between them. `lastPushAt` backs
-- | the cooldown in `component`'s `handleQuery` -- `Nothing` until the
-- | first real card lands.
type State = { cards :: Zipper CardContent, lastPushAt :: Maybe Instant }

initialState :: Input -> State
initialState _ = { cards: Z.singleton emptyCard, lastPushAt: Nothing }

-- | Cards can arrive faster than a person can read one (a solver racing
-- | through tests back-to-back, say). Anything that lands within this long
-- | of the last card that actually made it onto the stack is silently
-- | dropped -- never displayed, not even queued -- so the stack never
-- | shows more than one card per second.
cooldown :: Milliseconds
cooldown = Milliseconds 1000.0

-- | True once `cooldown` has fully elapsed since `lastPushAt` -- `Nothing`
-- | (no card shown yet) is always off cooldown. Pulled out of `handleQuery`
-- | as a plain function so the cooldown boundary can be unit tested without
-- | going through `HalogenM`/`Effect.Now`.
isOffCooldown :: Milliseconds -> Maybe Instant -> Instant -> Boolean
isOffCooldown (Milliseconds cd) lastPushAt nowInstant = case lastPushAt of
  Nothing -> true
  Just last -> case diff nowInstant last of
    Milliseconds elapsed -> elapsed >= cd

data Query a = PushCard CardContent a

data Action
  = ViewPreviousCard
  | ViewNextCard

data Output = Void

slot = Proxy :: Proxy "cardStack"

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where
    eval = mkEval (defaultEval { handleAction = handleAction, handleQuery = handleQuery })

    handleAction :: Action -> H.HalogenM State Action () Output m Unit
    handleAction = case _ of
      ViewPreviousCard -> H.modify_ (\s -> s { cards = fromMaybe s.cards (Z.moveLeft s.cards) })
      ViewNextCard -> H.modify_ (\s -> s { cards = fromMaybe s.cards (Z.moveRight s.cards) })

    handleQuery :: forall a. Query a -> H.HalogenM State Action () Output m (Maybe a)
    handleQuery = case _ of
      PushCard content next -> do
        nowInstant <- H.liftEffect now
        { lastPushAt, cards } <- H.get
        when (isOffCooldown cooldown lastPushAt nowInstant) do
          -- appendRight inserts without moving focus, so follow it with a
          -- moveRight onto the card just inserted -- otherwise it lands in
          -- the zipper but never actually shows (render displays the
          -- focus). Always succeeds: appendRight guarantees a non-empty
          -- right side to move into.
          let appended = Z.appendRight content (Z.focusMostRight cards)
          H.modify_ (_ { cards = fromMaybe appended (Z.moveRight appended), lastPushAt = Just nowInstant })
        pure (Just next)

render :: forall slots m. State -> ComponentHTML Action slots m
render state =
  HH.div
    [ HP.class_ (ClassName "card-stack-component") ]
    [ HH.div [ HP.class_ (ClassName "stage") ] [ cardMount ] ]
  where
    -- Keyed on each card's position in the zipper: a genuinely new key
    -- mounts a fresh DOM node (replaying the entrance animation), while the
    -- same key just patches in place. Rendering the current card *and* the
    -- one immediately before it (when one exists) means the outgoing card
    -- stays visible, layered underneath, instead of vanishing the instant a
    -- new one is pushed -- the incoming card covers it as it animates in.
    -- Keying the previous card on its own real position (not a fixed
    -- "previous" label) means it isn't remounted when it was itself the
    -- current card a moment ago -- same DOM node throughout.
    --
    -- The previous card is rendered `isCurrent = false`, forcing its
    -- animation off explicitly (`.card-previous` in CSS) rather than
    -- relying on `animation-fill-mode: both` to keep holding its finished
    -- state once the Keyed diff moves its DOM node from the current slot to
    -- the previous one -- a same-key patch shouldn't restart a CSS
    -- animation, but a reorder is exactly the kind of edge case where that
    -- assumption can quietly break, and the fix is cheap either way.
    cardMount = HK.div [ HP.class_ (ClassName "card-mount") ] (previousEntry <> [ currentEntry ])

    currentEntry =
      let i = Z.currentIndex state.cards
      in Tuple (show i) (renderCard i true (Z.head state.cards))

    previousEntry = case Z.moveLeft state.cards of
      Nothing -> []
      Just prevCards ->
        let i = Z.currentIndex prevCards
        in [ Tuple (show i) (renderCard i false (Z.head prevCards)) ]

    renderCard :: Int -> Boolean -> CardContent -> ComponentHTML Action slots m
    renderCard seed isCurrent content
      | content == emptyCard =
          HH.div [ HP.classes [ ClassName "card", ClassName "card-empty" ] ] []
      | otherwise =
          HH.div
            [ HP.classes ([ ClassName "card" ] <> if isCurrent then [] else [ ClassName "card-previous" ])
            , HP.style (wobbleFor seed)
            ]
            ( [ HH.div [ HP.class_ (ClassName "card-head") ] (title <> statusLabel) ]
                <> textLines
            )
      where
        title = [ HH.span [ HP.class_ (ClassName "card-title") ] [ HH.text content.title ] ]
        statusLabel = maybe [] renderStatusBar content.statusBar
        textLines = map renderLine content.text

        renderStatusBar { status, text } =
          [ HH.span
              [ HP.class_ (ClassName "status-pill")
              , HP.attr (AttrName "data-card-status") (statusAttr status)
              ]
              [ HH.text text ]
          ]

        renderLine line = HH.div [ HP.class_ (ClassName "card-row") ] [ HH.text line ]

    statusAttr :: CardStatus -> String
    statusAttr = case _ of
      Pending -> "pending"
      Active -> "active"
      Success -> "success"
      Failure -> "failure"

-- | A tiny, deterministic-per-seed "randomized" rotation + offset so real
-- | cards don't all land in an identical, too-perfect spot -- reads as
-- | tossed down rather than printed. Same seed always gives the same
-- | wobble (a card doesn't jitter on re-render, since it's keyed on the
-- | zipper position used as its `render` key); different seeds look
-- | uncorrelated. `zoomInDown` has no explicit `100%` keyframe, so it
-- | settles into whatever this static `transform` says rather than
-- | `transform: none` -- the card zooms in and comes to rest already
-- | wobbled, no extra animation step needed.
wobbleFor :: Int -> String
wobbleFor seed =
  "transform: rotate(" <> show rotateDeg <> "deg) translate(" <> show translateX <> "px, " <> show translateY <> "px);"
  where
  -- Classic GLSL-style pseudo-random: fract(sin(x) * big number). Different
  -- multipliers per axis so the three values don't just track each other.
  rand :: Number -> Number
  rand x = let v = sin x * 43758.5453 in v - floor v

  n = toNumber seed
  rotateDeg = (rand (n * 12.9898) - 0.5) * 3.0
  translateX = (rand (n * 78.233) - 0.5) * 6.0
  translateY = (rand (n * 37.719) - 0.5) * 6.0
