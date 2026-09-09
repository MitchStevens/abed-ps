module Component.CardStack where

import Prelude

import Data.Array as A
import Data.Lens (set)
import Data.Unfoldable (unfoldr)
import Data.Int (toNumber)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Number (floor, sin)
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Effect.Class (class MonadEffect)
import Game.Level.Demonstration (Demonstration)
import GlobalState (GlobalState, GlobalStateAction(..))
import Halogen (AttrName(..), ClassName(..), ComponentHTML, defaultEval, mkEval)
import Halogen as H
import Halogen.HTML (PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Elements.Keyed as HK
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Store.Monad (class MonadStore, updateStore)
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
  -- | Richer, purely-presentational content (e.g. `Component.TestCard`'s
  -- | diagram + read-out) rendered between the head and `text`. `PlainHTML`
  -- | rather than `ComponentHTML` for the same reason `Demonstration`
  -- | carries one: this record can't be parameterized over `action`/`slots`/
  -- | `m` without dragging every call site along with it.
  , diagram :: Maybe PlainHTML
  -- | When set, the card grows a button that opens this demonstration --
  -- | see `DemonstrationClicked`/`Output`. Nothing shows no button.
  , demonstration :: Maybe Demonstration
  }

-- | The permanent occupant of the slot. Because `State.cards` is a `Zipper`
-- | (never empty), this is what it's seeded with, and what's left showing
-- | once every real card has been stepped past -- there's no separate
-- | "nothing to show" branch, just a card that happens to render as an
-- | indentation (see `render`'s `card-empty` class).
emptyCard :: CardContent
emptyCard = { title: "", statusBar: Nothing, text: [], diagram: Nothing, demonstration: Nothing }

-- | `CardContent` can't derive `Eq` any more -- `Demonstration` carries a
-- | `PlainHTML`, which has none -- so this compares only the fields that
-- | actually distinguish "nothing to show" from a real card.
isEmptyCard :: CardContent -> Boolean
isEmptyCard content =
  content.title == emptyCard.title
    && content.statusBar == emptyCard.statusBar
    && content.text == emptyCard.text

type Input = Unit

-- | Cards live in a zipper so we can flip between them.
type State = { cards :: Zipper CardContent }

initialState :: Input -> State
initialState _ = { cards: Z.singleton emptyCard }

data Query a
  = PushCard CardContent a
  -- | Overwrites the focused card's content without moving the zipper or
  -- | touching its history -- for a card whose story is "the same test,
  -- | further along" (pending -> running -> passed/failed) rather than a
  -- | genuinely new thing to show. Keyed on the same zipper index as
  -- | before, so the Keyed diff patches the existing DOM node in place
  -- | instead of remounting it -- no replayed entrance animation, no new
  -- | entry in the stack behind it.
  | ReplaceCard CardContent a

data Action
  = ViewPreviousCard
  | ViewNextCard
  | DemonstrationClicked Demonstration

-- | No output any more -- `DemonstrationClicked` goes straight to the store
-- | (see `GlobalState.RequestDemonstration`) instead of raising, so whoever
-- | ends up owning `Component.Demonstration` doesn't matter to this component.
type Output = Void

slot = Proxy :: Proxy "cardStack"

component :: forall m. MonadEffect m => MonadStore GlobalStateAction GlobalState m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where
    eval = mkEval (defaultEval { handleAction = handleAction, handleQuery = handleQuery })

    handleAction :: Action -> H.HalogenM State Action () Output m Unit
    handleAction = case _ of
      ViewPreviousCard -> H.modify_ (\s -> s { cards = fromMaybe s.cards (Z.moveLeft s.cards) })
      ViewNextCard -> H.modify_ (\s -> s { cards = fromMaybe s.cards (Z.moveRight s.cards) })
      DemonstrationClicked demonstration -> updateStore (RequestDemonstration demonstration)

    handleQuery :: forall a. Query a -> H.HalogenM State Action () Output m (Maybe a)
    handleQuery = case _ of
      PushCard content next -> do
        { cards } <- H.get
        -- appendRight inserts without moving focus, so follow it with a
        -- moveRight onto the card just inserted -- otherwise it lands in
        -- the zipper but never actually shows (render displays the
        -- focus). Always succeeds: appendRight guarantees a non-empty
        -- right side to move into.
        let appended = Z.appendRight content (Z.focusMostRight cards)
        H.modify_ (_ { cards = fromMaybe appended (Z.moveRight appended) })
        pure (Just next)

      ReplaceCard content next -> do
        H.modify_ (\s -> s { cards = set Z._head content s.cards })
        pure (Just next)

-- | How many past cards peek out from underneath the current one. Purely
-- | decorative -- these aren't interactive, they just show that there's a
-- | history to the stack.
maxStackDepth :: Int
maxStackDepth = 6

-- | Up to `n` cards immediately behind the focus, nearest-first (one step
-- | left, two steps left, ...), paired with their zipper index -- stops
-- | early once `moveLeft` runs out.
previousCards :: forall a. Int -> Zipper a -> Array (Tuple Int a)
previousCards n z = A.take n (unfoldr step z)
  where
  step zipper = do
    prev <- Z.moveLeft zipper
    pure (Tuple (Tuple (Z.currentIndex prev) (Z.head prev)) prev)

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
    --
    -- `stackEntries` adds a few more cards behind that, purely for depth --
    -- plain `position: absolute; inset: 0` elements paint in DOM order when
    -- nothing sets z-index, so listing the *farthest* one first and the
    -- current card last is what puts current on top without any z-index at
    -- all.
    cardMount = HK.div [ HP.class_ (ClassName "card-mount") ] (stackEntries <> previousEntry <> [ currentEntry ])

    currentEntry =
      let i = Z.currentIndex state.cards
      in Tuple (show i) (renderCard i true (Z.head state.cards))

    previousEntry = case Z.moveLeft state.cards of
      Nothing -> []
      Just prevCards ->
        let i = Z.currentIndex prevCards
        in [ Tuple (show i) (renderCard i false (Z.head prevCards)) ]

    -- Cards two-or-more steps back. `previousCards` already covers "one
    -- step back" (that's `previousEntry`, kept separate for the crossfade),
    -- so this starts at depth 2; the placeholder `emptyCard` never actually
    -- has history behind it, but it's filtered out just in case a stack
    -- that started mid-history somehow reaches it.
    stackEntries =
      previousCards maxStackDepth state.cards
        # A.mapWithIndex (\ix (Tuple i content) -> Tuple (ix + 1) (Tuple i content))
        # A.drop 1
        # A.filter (\(Tuple _ (Tuple _ content)) -> not (isEmptyCard content))
        # A.reverse
        # map (\(Tuple depth (Tuple i content)) -> Tuple (show i) (renderStackedCard depth i content))

    renderCard :: Int -> Boolean -> CardContent -> ComponentHTML Action slots m
    renderCard seed isCurrent content
      | isEmptyCard content =
          HH.div [ HP.classes [ ClassName "card", ClassName "card-empty" ] ] []
      | otherwise =
          HH.div
            [ HP.classes ([ ClassName "card" ] <> if isCurrent then [] else [ ClassName "card-previous" ])
            , HP.style (wobbleFor seed)
            ]
            (cardBody content)

    -- A card further back in the stack: same body, but offset down and
    -- rotated a bit more per step back (`stackWobbleFor`) so it reads as a
    -- messy pile rather than a perfectly aligned deck, and never animates
    -- or reacts to clicks -- it's scenery, not a card you can be on.
    renderStackedCard :: Int -> Int -> CardContent -> ComponentHTML Action slots m
    renderStackedCard depth seed content =
      HH.div
        [ HP.classes [ ClassName "card", ClassName "card-stacked" ]
        , HP.style (stackWobbleFor depth seed)
        ]
        (cardBody content)

    cardBody :: CardContent -> Array (ComponentHTML Action slots m)
    cardBody content =
      [ HH.div [ HP.class_ (ClassName "card-head") ] (title <> statusLabel) ]
        <> diagram
        <> textLines
        <> demonstrationButton
      where
        title = [ HH.span [ HP.class_ (ClassName "card-title") ] [ HH.text content.title ] ]
        statusLabel = maybe [] renderStatusBar content.statusBar
        diagram = maybe [] (A.singleton <<< fromPlainHTML) content.diagram
        textLines = map renderLine content.text
        demonstrationButton = maybe [] renderDemonstrationButton content.demonstration

        renderStatusBar { status, text } =
          [ HH.span
              [ HP.class_ (ClassName "status-pill")
              , HP.attr (AttrName "data-card-status") (statusAttr status)
              ]
              [ HH.text text ]
          ]

        renderLine line = HH.div [ HP.class_ (ClassName "card-row") ] [ HH.text line ]

        renderDemonstrationButton demonstration =
          [ HH.button
              [ HP.class_ (ClassName "card-demonstration-button")
              , HE.onClick (\_ -> DemonstrationClicked demonstration)
              ]
              [ HH.text "Show me" ]
          ]

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
  n = toNumber seed
  rotateDeg = (rand (n * 12.9898) - 0.5) * 3.0
  translateX = (rand (n * 78.233) - 0.5) * 6.0
  translateY = (rand (n * 37.719) - 0.5) * 6.0

-- | Same idea as `wobbleFor`, but for a card sitting `depth` steps back in
-- | the stack: it needs to peek out from *below* the cards in front of it,
-- | so on top of the per-seed jitter there's a steady downward march (~7px
-- | a step) and a little extra rotation the further back it sits, so the
-- | pile reads as leaning outward rather than a neat, unnaturally even fan.
stackWobbleFor :: Int -> Int -> String
stackWobbleFor depth seed =
  "transform: rotate(" <> show rotateDeg <> "deg) translate(" <> show translateX <> "px, " <> show translateY <> "px);"
  where
  n = toNumber seed
  d = toNumber depth
  rotateDeg = (rand (n * 12.9898) - 0.5) * (3.0 + d)
  translateX = (rand (n * 78.233) - 0.5) * (6.0 + d)
  translateY = d * 7.0 + (rand (n * 37.719) - 0.5) * 4.0

-- Classic GLSL-style pseudo-random: fract(sin(x) * big number). Different
-- multipliers per axis (see call sites) so the values don't just track
-- each other.
rand :: Number -> Number
rand x = let v = sin x * 43758.5453 in v - floor v
