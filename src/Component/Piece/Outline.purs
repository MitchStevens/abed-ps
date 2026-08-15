module Component.Piece.Outline
  ( Action(..)
  , Input
  , Query(..)
  , State
  , component
  , initialState
  , slot
  )
  where

import Prelude

import Component.Rendering.Segment (Segment, toPath)
import Data.Maybe (Maybe(..), isJust)
import Debug (trace)
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, defaultEval, get, mkComponent, mkEval, modify_)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.Subscription as HS
import Halogen.Svg.Attributes (Color(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Attributes.StrokeLineCap (StrokeLineCap(..))
import Halogen.Svg.Attributes.StrokeLineJoin (StrokeLineJoin(..))
import Halogen.Svg.Elements as SE
import Type.Proxy (Proxy(..))

-- | The path currently shown, plus (while a shape change is still
-- | crossfading in) the path it's replacing, plus the current fill.
type State = { current :: Array Segment, fadingOut :: Maybe (Array Segment), fill :: String }

-- | `fill` is anything an SVG `fill` accepts -- a colour, or a
-- | `"url(#patternId)"` reference.
type Input = { segments :: Array Segment, fill :: String }

-- | `Transition target a`: tell the outline to crossfade to `target`, same
-- | as the internal `TransitionTo` action -- lets a parent drive an
-- | animated shape change without owning any of the fade itself.
data Query a = Transition (Array Segment) a

data Action
  = SetPath (Array Segment)
  -- | Crossfade from the current path to this one: draw both at once, the
  -- | old one fading out and the new one fading in together over
  -- | `fadeDuration` (see `outline-fade-in`/`outline-fade-out` in the
  -- | stylesheet -- this only ever toggles which CSS classes are on screen,
  -- | the browser does the actual animating).
  | TransitionTo (Array Segment)
  -- | The fade has finished playing -- drop the old path, it's invisible now.
  | EndTransition
  -- | Unlike `segments` (see `Input`'s doc below), `fill` has no crossfade
  -- | to protect, so it just always tracks the latest Input.
  | Receive Input

slot = Proxy :: Proxy "outline"

initialState :: Input -> State
initialState { segments, fill } = { current: segments, fadingOut: Nothing, fill }

-- | How long the old and new outline take to crossfade. Matches the
-- | `320ms` baked into `outline-fade-in`/`outline-fade-out`'s
-- | `animation-duration` -- the two aren't wired together, so keep them in
-- | sync by hand if either changes.
fadeDuration :: Milliseconds
fadeDuration = Milliseconds 320.0

-- | Draws a single Segment path -- nothing more, except while a
-- | `TransitionTo`/`Transition` is still crossfading, when it draws the old
-- | one underneath too, fading out as the new one fades in. `Input`'s
-- | `segments` only sets the starting path at mount; after that, a parent
-- | drives shape changes explicitly via the `Transition` query, so an
-- | in-progress fade can't be clobbered by an unrelated re-render passing
-- | the same input again. `fill` has no such concern, so it just updates
-- | directly off `Input` on every render via `Receive`.
component :: forall output m. MonadAff m => Component Query Input output m
component =
  mkComponent
    { initialState
    , render
    , eval: mkEval $ defaultEval
        { handleAction = handleAction
        , handleQuery = handleQuery
        , receive = Just <<< Receive
        }
    }
  where
  render :: State -> ComponentHTML Action () m
  render state = trace ("Outline.render: fadingOut=" <> show (isJust state.fadingOut)) \_ ->
    SE.g [] (fadingOutPath <> [ currentPath ])
    where
    fadingOutPath = case state.fadingOut of
      Just old -> [ SE.g [ SA.classes [ ClassName "outline-fade-out" ] ] [ renderFilledPath state.fill old ] ]
      Nothing -> []

    currentPath = SE.g fadeInClass [ renderFilledPath state.fill state.current ]
    fadeInClass
      | isJust state.fadingOut = [ SA.classes [ ClassName "outline-fade-in" ] ]
      | otherwise = []

  handleAction :: Action -> HalogenM State Action () output m Unit
  handleAction = case _ of
    SetPath path -> modify_ _ { current = path, fadingOut = Nothing }
    TransitionTo target -> do
      { current } <- get
      modify_ _ { current = target, fadingOut = Just current }
      _ <- H.subscribe =<< after fadeDuration EndTransition
      pure unit
    EndTransition -> modify_ _ { fadingOut = Nothing }
    Receive input -> modify_ _ { fill = input.fill }

  handleQuery :: forall a. Query a -> HalogenM State Action () output m (Maybe a)
  handleQuery = case _ of
    Transition target a -> do
      handleAction (TransitionTo target)
      pure (Just a)

renderFilledPath :: forall w i. String -> Array Segment -> HTML w i
renderFilledPath fillValue segments =
  SE.path
    [ SA.fill (Named fillValue)
    , SA.stroke (Named "black")
    , SA.strokeWidth 1.0
    , SA.strokeLineJoin LineJoinRound
    , SA.strokeLineCap LineCapRound
    , SA.d (toPath segments)
    ]

-- | An `Emitter` that fires `value` once, after `delay` -- same `HS.create`
-- | + forked loop + `notify` shape as the Halogen guide's `timer`, but a
-- | single one-shot notification instead of a repeating (or stepped)
-- | series.
after :: forall m a. MonadAff m => Milliseconds -> a -> m (HS.Emitter a)
after delay value = do
  { emitter, listener } <- H.liftEffect HS.create
  _ <- H.liftAff $ Aff.forkAff do
    Aff.delay delay
    H.liftEffect $ HS.notify listener value
  pure emitter
