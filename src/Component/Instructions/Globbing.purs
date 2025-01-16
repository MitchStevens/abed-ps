module Component.Instructions.Globbing where

import Prelude

import AppM (AppM)
import Component.Board as Board
import Component.Instructions.BoardDiagram as BoardDiagram
import Data.Array as A
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Board (Board(..))
import Game.Location (location)
import Game.Piece (idPiece)
import Game.Rotation (rotation)
import Halogen (Component, ComponentHTML, Slot, Tell)
import Halogen as H
import Halogen.HTML as HH
import Type.Proxy (Proxy(..))

type Action = Void

type Slots = 
  ( boardDiagram :: Slot BoardDiagram.Query BoardDiagram.Output Unit )

slot = Proxy :: Proxy "instructionsGlobbing"

{-
component :: forall q i. Component q i Void AppM
component = H.mkComponent { eval: H.mkEval H.defaultEval, render, initialState: identity}
  where
    render :: i -> ComponentHTML Action Slots AppM
    render _ = 
      HH.div_ 
        [ HH.text "When pieces are adjacent to other pieces, they sometimes automatically connect to each other:"
        , firstDiagram
        ]

    firstDiagram = HH.slot_ BoardDiagram.slot unit BoardDiagram.component
      { board: Board { size: 2, pieces }
      , initialise: reset
      , actions: M.fromFoldable [ Tuple "Reset" reset, Tuple "glob" glob ]
      , description: "hello world"
      }
      where
        pieces = M.fromFoldable
          [ Tuple (location 0 0) { piece: idPiece, rotation: rotation 0 }
          , Tuple (location 1 1) { piece: idPiece, rotation: rotation 1 } 
          ]
        reset =
          [ Board.Clear
          , const $ Board.AddPiece (location 0 0) idPiece (const unit)
          , const $ Board.AddPiece (location 1 1) idPiece (const unit)
          , const $ Board.RotatePieceBy (location 1 1) (rotation 1) (const unit)
          ]
        glob = 
          [ const $ Board.RemovePiece (location 1 1) (const unit)
          , const $ Board.AddPiece (location 0 1) idPiece (const unit)
          , const $ Board.RotatePieceBy (location 0 1) (rotation 1) (const unit)
          ]
