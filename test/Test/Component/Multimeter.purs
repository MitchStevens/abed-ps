module Test.Component.Multimeter where

import Prelude

import Component.Multimeter (padStart)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Component.Multimeter" do
  it "padStart" do
    padStart "*" 0 "123" `shouldEqual` "123"
    padStart "*" 3 "123" `shouldEqual` "123"
    padStart "*" 4 "123" `shouldEqual` "*123"
    padStart "*" 5 "123" `shouldEqual` "**123"
    padStart " " 5 "hi" `shouldEqual` "   hi"