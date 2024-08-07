module CSS.Board where

import Prelude

import CSS.Colors (lightGray)
import Halogen.HTML (ClassName(..), HTML(..))
import Tecton (CSS, ElementId(..), aspectRatio, borderBottomStyle, borderBox, borderColor, borderWidth, boxSizing, display, grid, height, hidden, overflow, pct, px, solid, universal, width, zIndex, (&#), (&.), (:/), (:=), (?))
import Tecton.Halogen (styleSheet)
import Tecton.Internal (Extensible, Selector)
import Tecton.Rule as Rule
import Web.HTML.Common (ClassName(..))



boardComponent :: Selector Extensible
boardComponent = universal &# ElementId "board-component"

boardStyleSheet :: CSS
boardStyleSheet =  do
  boardComponent ? Rule.do
     aspectRatio := 1 :/ 1
     display := grid
    
  boardComponent &. ClassName "piece" ? Rule.do
    boxSizing := borderBox
    height := pct 100
    width := pct 100
    aspectRatio := 1 :/ 1
    zIndex := 0
    borderColor := lightGray
    borderWidth := px 2
    borderBottomStyle := solid
    overflow := hidden
  
  
  



