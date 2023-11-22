module IO.Conversations where

import Prelude

import Data.Array as A
import Data.Int (toNumber)
import Data.String as String
import Data.Time.Duration (Seconds(..))
import Foreign.Object (Object, fromHomogeneous)
import Game.Message (Message, addDelay, message)
import Game.Message as Message

user = { god: "jrizz" }

--foreign import conversation1 :: Array QueuedMessage

dialogue :: Array String -> Array String -> Array Message
dialogue _ [] = []
dialogue users messages = A.zipWith message users before <> dialogue users after
  where { before, after } = A.splitAt (A.length users) messages

conversations :: Object (Object (Array Message))
conversations = (map<<<map<<<map) addDelay $ fromHomogeneous
  { "Tutorial Suite": fromHomogeneous
    { "From A to B": dialogue [user.god]
      [ "hi! glad you made it"
      , "welcome "
      , "you find yourself at the game board"
      ]
    }
  }


--conversation2 :: Array QueuedMessage
--conversation2 = map (\text -> { user: "big_dnnr", text, delayBy: timeToRead text })
--  [ ""
--  , "hey big d here with a quick demo/tutoral"
--  , "so you've got these things called 'pieces' which take input from the left side and output to the right"
--  , "(pieces can take input/output on any of the cardinal directions but these pieces are simple)"
--  , "the first piece 'id' (short for IDENTITY) takes a signal from the left and outputs the same signal to the right"
--  , "the second piece 'not' takes a signal from the left and negates it"
--  , "true become false, false becomes true"
--  , "double click 'id' to add an 'id' piece to the board"
--  , "... i assume you added the piece? i haven't integrated the chat feature with th board yet so i'm pretty blind lmao"
--  , "the empty circles represent input ports and the black circles are output ports"
--  , "click and the drag the piece to the locatin (2, 1). note that when you do this the message in the sidebar changes"
--  , "note that the sidebar message changes from 'You need an Input in the Left direction' after you move the piece" 
--  , "So now the sidebar says 'You need an Input in the Left direction'"
--  , "lets add another 'id' piece and move it to the left, remember double click!"
--  , "you should see some weird output in the sidebar, i haven't fixed this part yet"
--  , "i'll cut to the soluion; the puzzle is complete when you connect the left side to the right side with two 'not' pieces and an 'id' piece"
--  , "if you get 'failed predicate it's because you used too many 'id' pieces. you only need one!"
--  , "once you've completed the level, sidebar says 'problem complete'"
--  , "it's a little underwhelming for now"
--  , "ok that's the whole demo, big d out :)"
--  ]
