module Test.Game.PortInfo where

import Prelude

import Game.Capacity (Capacity(..))
import Game.Direction (allDirections)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece (defaultPortInfo, getPorts, idPiece)
import Game.Port (hasPort, inputPort, noPort, outputPort)
import Game.PortInfo (hasPortInfo, noPortInfo)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Game.PortInfo" do
  describe "noPortInfo" do
    it "isn't a real port's info" do
      hasPortInfo noPortInfo `shouldEqual` false
    it "holds noPort, unconnected and zero" do
      noPortInfo `shouldEqual` { port: noPort, connected: false, signal: zero }
    it "leaves the info of a real port a port's info" do
      hasPortInfo { port: inputPort OneBit, connected: false, signal: zero } `shouldEqual` true

  describe "defaultPortInfo" do
    it "has an info exactly where the piece has a port, and noPortInfo everywhere else" do
      let info = defaultPortInfo idPiece
      Frame.index Direction.Left info `shouldEqual` { port: inputPort OneBit, connected: false, signal: zero }
      Frame.index Direction.Right info `shouldEqual` { port: outputPort OneBit, connected: false, signal: zero }
      Frame.index Direction.Up info `shouldEqual` noPortInfo
      Frame.index Direction.Down info `shouldEqual` noPortInfo
    it "agrees with the piece's own ports about which sides are real" do
      let
        info = defaultPortInfo idPiece
        ports = getPorts idPiece
      map (\dir -> hasPortInfo (Frame.index dir info)) allDirections
        `shouldEqual` map (\dir -> hasPort (Frame.index dir ports)) allDirections
