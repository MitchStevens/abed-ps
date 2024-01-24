export const puzzleElement  = () => document.querySelector("#puzzle-component")
export const boardElement   = () => document.querySelector("#board-component")
export const sidebarElement = () => document.querySelector("#sidebar-component")


export const boardPortElementString = direction => () => 
  boardElement().querySelector(".board-port[data-direction='"+ direction +"']")

export const diagramElement = () => 
  sidebarElement().querySelector(".board-port-diagram")

export const diagramPortElementString = direction => () =>
  diagram().querySelector("g[data-direction='"+ direction +"']")

export const completionStatusElement = () => sidebarElement().querySelector("div.completion-status")

export const locationAtElement = loc => () =>
  boardElement().querySelector("div[data-location='("+ loc.x + "," + loc.y + ")']")