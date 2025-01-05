module Component.Sidebar.BoardSizeSlider where

import Prelude

import Capability.Animate (headShake)
import Component.Sidebar.Segment (segment)
import Control.Monad.Error.Class (throwError)
import Data.Foldable (for_)
import Data.Int as Int
import Data.Maybe (Maybe(..), maybe, maybe')
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Exception (error, throw)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, HalogenQ, gets, liftEffect, mkComponent, mkEval, modify_, put)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.Event.Internal.Types (Event)
import Web.HTML (HTMLInputElement, window)
import Web.HTML.HTMLDocument as HTMLDocument
import Web.HTML.HTMLInputElement as HTMLInputElement
import Web.HTML.Window as Window

type Input = { boardSize :: Int }

type State = Input

data Query a
  = AmendBoardSizeSlider Int a

data Action
  = Initialise Input
  | InputRangeChange
  | InputRangeMouseUp

data Output 
  = BoardSizeChange { boardSize :: Int }


component :: forall m. MonadAff m => Component Query Input Output m
component = mkComponent { eval, initialState, render }
  where
    initialState = identity

    eval :: HalogenQ Query Action Input ~> HalogenM State Action () Output m
    eval = mkEval
      { finalize: Nothing
      , handleAction
      , handleQuery: case _ of
          AmendBoardSizeSlider boardSize next -> do
            modify_ (_ { boardSize = boardSize })
            handleAction InputRangeMouseUp
            pure (Just next)
      , initialize: Nothing
      , receive: Just <<< Initialise
      }
      where
        handleAction = case _ of
          Initialise state -> put state
          InputRangeChange -> do
            boardSize <- liftEffect getValue
            H.raise (BoardSizeChange { boardSize } )
          InputRangeMouseUp -> do
            sliderValue <- liftEffect getValue
            boardSize <- gets (_.boardSize)
            when (sliderValue /= boardSize) do
              liftEffect (setValue boardSize)
              headShake (QuerySelector "#sidebar-component .board-size h2")
    
    render :: State -> ComponentHTML Action () m
    render state = 
      segment (ClassName "board-size") title html
      where
        title = HH.text ("Board size: " <> show state.boardSize)
        html =
          HH.span_
            [ HH.input
              [ HP.type_ HP.InputRange
              , HP.list "values"
              , HP.min 3.0
              , HP.max 9.0
              , HP.step (HP.Step 2.0)
              , HP.value (show state.boardSize)
              , HE.onInput   (const InputRangeChange)
              , HE.onMouseUp (const InputRangeMouseUp)
              ]
            , HH.datalist
              [ HP.id "values" ]
              [ HH.option [ HP.value "3" ] []
              , HH.option [ HP.value "5" ] []
              , HH.option [ HP.value "7" ] []
              , HH.option [ HP.value "9" ] []
              ]
            ]

slot :: Proxy "boardSizeSlider"
slot = Proxy

inputRange :: Effect HTMLInputElement
inputRange = do
  htmlDocument <- window >>= Window.document
  let parentNode = HTMLDocument.toParentNode htmlDocument
  let selector = QuerySelector "#sidebar-component .board-size input"
  maybeElement <- querySelector selector parentNode

  maybe' (\_ -> throw "couldn't find board size input element") pure (maybeElement >>= HTMLInputElement.fromElement)

getValue :: Effect Int
getValue = do
  value <- inputRange >>= HTMLInputElement.valueAsNumber
  pure (Int.floor value)

setValue :: Int -> Effect Unit
setValue boardSize = do
  inputRange >>= HTMLInputElement.setValueAsNumber (Int.toNumber boardSize)