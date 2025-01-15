module Component.Instructions.Globbing where

import Prelude

import AppM (AppM)
import Component.Instructions.BoardDiagram as BoardDiagram
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Board (Board(..))
import Game.Location (location)
import Game.Piece (idPiece)
import Game.Rotation (rotation)
import Halogen (Component, ComponentHTML, Slot)
import Halogen as H
import Halogen.HTML as HH
import Type.Proxy (Proxy(..))

type Slots = 
  ( boardDiagram :: Slot BoardDiagram.Query BoardDiagram.Output Unit )

slot = Proxy :: Proxy "instructionsGlobbing"

component :: forall q i. Component q i Void AppM
component = H.mkComponent { eval: H.mkEval H.defaultEval, render, initialState: identity}
  where
    render :: forall a. i -> ComponentHTML a Slots AppM
    render _ = 
      HH.div_ 
        [ HH.text "When pieces are adjacent to other pieces, they sometimes automatically connect to each other:"
        , HH.slot_ BoardDiagram.slot unit BoardDiagram.component
          { board: Board
            { size: 2
            , pieces: M.fromFoldable
              [ Tuple (location 0 0) { piece: idPiece, rotation: rotation 0 }
              , Tuple (location 1 1) { piece: idPiece, rotation: rotation 1 }
              ]
            }
          , actions: M.fromFoldable
            [ Tuple "Reset" [ Clear Unit, AddPiece (location 0 0) ]

            ]
          , description: "first diagram"
          }

        ]

    firstDiagram 
      where
        input = { size: 2, pieces }
        pieces = 
          [ Tuple (location 0 0) { piece: idPiece, rotation: rotation 0 }
          , Tuple (location 1 1) { piece: idPiece, rotation: rotation 1 } 
          ]