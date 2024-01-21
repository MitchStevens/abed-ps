export const puzzleElement  = document.querySelector("#puzzle-component")
export const boardElement   = document.querySelector("#board-component")
export const sidebarElement = document.querySelector("#sidebar-component")

export const completionStatus = () => sidebarElement.querySelector("div.completion-status")

export const boardPortLeft = () => boardElement.querySelector(".board-port[data-direction='left']")
export const boardPortRight = () => boardElement.querySelector(".board-port[data-direction='right']")

export const diagram = () => sidebarElement.querySelector(".board-port-diagram")
export const diagramLeftPort = () => diagram.querySelector("g[data-direction='left']")
export const diagramRightPort = () => diagram.querySelector("g[data-direction='right']")

export const locationAt = x => y => () =>
  boardElement.querySelector("div[data-location='("+ x + "," + y + ")']")

export const pieceAt = x => y => () =>
  location(x)(y)().querySelector(".piece-component")