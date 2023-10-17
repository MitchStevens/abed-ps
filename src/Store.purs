module Store where

import Prelude

import Capability.ChatServer (ChatServer)

type Store =
  { chatServer :: ChatServer
  }