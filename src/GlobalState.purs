module GlobalState where

import Prelude

import Capability.ChatServer (ChatServer)

type GlobalState =
  { chatServer :: ChatServer
  }