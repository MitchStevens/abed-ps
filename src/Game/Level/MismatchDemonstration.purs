module Game.Level.MismatchDemonstration where

import Prelude

import Data.Maybe (Maybe(..))
import Game.Level.Completion (PortMismatch(..))
import Game.Level.Demonstration (Demonstration, videoDemonstration)
import Game.Port (Port(..), PortType(..))

needInputDemonstration :: Demonstration
needInputDemonstration = videoDemonstration
  { title: "Adding an input"
  , videoUrl: "./static/images/demonstrations/need_input.mp4"
  , description: "This edge needs to receive a signal -- add a piece with an input facing this direction."
  }

needOutputDemonstration :: Demonstration
needOutputDemonstration = videoDemonstration
  { title: "Adding an output"
  , videoUrl: "./static/images/demonstrations/need_output.mp4"
  , description: "This edge needs to send a signal out -- add a piece with an output facing this direction."
  }

-- | Which demonstration (if any) helps with a given port mismatch. Only
-- | `PortExpected` has one -- it's the only case that says what to *add*;
-- | the others are about removing or correcting something already there,
-- | which doesn't have a video yet.
mismatchDemonstration :: PortMismatch -> Maybe Demonstration
mismatchDemonstration = case _ of
  PortExpected { expected: Port { portType: Input } } -> Just needInputDemonstration
  PortExpected { expected: Port { portType: Output } } -> Just needOutputDemonstration
  NoPortExpected _ -> Nothing
  IncorrectPortType _ -> Nothing
  IncorrectCapacity _ -> Nothing
