var n = 0
export const getValue = () => n
export const addOne = () => { n = n + 1 }


var name = null
export const getName = () => name
export const setName = () => { name = "mitch" }


const goal = 71
export const checkNumber = guess => () => guess == goal
export const isGreaterThanGoal = guess => () => guess > goal
