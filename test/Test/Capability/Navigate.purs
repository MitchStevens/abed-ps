module Test.Capability.Navigate where

import Prelude

import Capability.Navigate (Route(..), Underscore(..), routeCodec, toUnderscore)
import Capability.Navigate as Navigate
import Data.Either (Either(..), isLeft)
import Data.Foldable (for_)
import Routing.Duplex (parse, print, segment)
import Routing.Duplex.Parser (RouteError(..))
import Test.Spec (Spec, describe, describeOnly, it, pending)
import Test.Spec.Assertions (shouldEqual, shouldSatisfy)

spec :: Spec Unit
spec = describe "Capability.Navigate" do
  describe "routeCodec" do
    describe "parse" do
      it "Home" do
        parse routeCodec "/home" `shouldEqual` Right Home
      it "About" do
        parse routeCodec "/about" `shouldEqual` Right About
      it "Instructions" do
        parse routeCodec "/how-to-play" `shouldEqual` Right Instructions
      it "LevelSelect" do
        parse routeCodec "/level-select" `shouldEqual` Right LevelSelect
      it "Level" do
        parse routeCodec "/level?suiteName=hello&levelName=world" `shouldEqual` Right (Navigate.level { suiteName: "hello", levelName: "world"})
        --parse routeCodec "/level?suiteName=hello%20big%20wide&levelName=world"    
        --  `shouldSatisfy` isLeft
        parse routeCodec "/level?suiteName=hello_big_wide&levelName=world"
          `shouldEqual` Right (Navigate.level { suiteName: "hello_big_wide", levelName: "world"})
      it "route '/' to home page" do
        parse routeCodec "/" `shouldEqual` Right Home
      it "route to home page when page not found" do
        parse routeCodec "/some-page-that-does-not-exist" `shouldEqual` Right Home

    it "round trip" do
      let routes = [ Navigate.home
        , Navigate.about
        , Navigate.instructions
        , Navigate.levelSelect
        , Navigate.level { suiteName: "A grand suite", levelName: "the glorious level" }
        ]
      for_ routes \route ->
        parse routeCodec (print routeCodec route) `shouldEqual` Right route
    describe "print" do
      it "Level" do
        print routeCodec (Navigate.level { suiteName: "hello", levelName: "world"}) 
          `shouldEqual` "/level?suiteName=hello&levelName=world"
        print routeCodec (Navigate.level { suiteName: "hello big", levelName: "wide world"})
          `shouldEqual` "/level?suiteName=hello_big&levelName=wide_world"