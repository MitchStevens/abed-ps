module Game.Piece.Port where

import Prelude

newtype Capacity = Capacity Int
derive instance Eq Capacity

instance Show Capacity where
  show (Capacity n) = "Capacity " <> show n

instance Semigroup Capacity where
  append (Capacity a) (Capacity b) = Capacity (a+b)

instance Monoid Capacity where
  mempty = Capacity 0

data Port
  = Input Capacity
  | Output Capacity
derive instance Eq Port

instance Show Port where
  show = case _ of
    Input capacity -> "Input (" <> show capacity <> ")"
    Output capacity -> "Output ("<> show capacity <>")"

isInput :: Port -> Boolean
isInput (Input _) = true
isInput _ = false

matchingPort :: Port -> Port
matchingPort (Input c) = Output c
matchingPort (Output c) = Input c

portMatches :: Port -> Port -> Boolean
portMatches port otherPort = port == matchingPort otherPort 

portCapacity :: Port -> Capacity
portCapacity = case _ of
  Input  capacity -> capacity
  Output capacity -> capacity