# how should board display required ports to user?
connected/not connected ->
    not connected = no outline around part of the arrow
    connected = outline line

signal on/off -> grey vs blue gradient

# how do we update the board?

## update connected ports

- get list of modified pieces
- get list of adjacent-to-modified pieces

## update signal ports
- evaluate the board

`Board -> Map RelativeEdge { isConnected :: Boolean, signal :: Signal }`