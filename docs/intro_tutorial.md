# from A to B

initialMessageQueue ->
    "click on the id button" ->
        glow id buttons

on add piece id 1 ->
    "move piece to (2, 1)"
        glow (2, 1)

on move piece:
    - ""
    - "add another piece" -> glow id button

on add Piece

## what does the rules engine need to do?
    - count all the previous rules that match predicates
    - and/or/not other rules 
    - the current delta
