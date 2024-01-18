import { driver } from "driver.js";

abedDriver = function(config) {
  config.allowKeyboardControl = false
  driverObj = driver(config)
  return driverObj
}




export const addPieceGuide = (onError, onSuccess) => {
  const idPiece = document.querySelector("div[data-available-piece='id-piece']")
  const location00 = document.querySelector("div[data-location='(0,0)']")

  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    steps: [
      { element: idPiece,
        popover:
          { description: "Click on the piece"
          , showButtons: []
          },
      },
      { element: location00,
        popover: { description: "The piece is then added to the first empty slot on the board" }
      }
    ],
    onDestroyed: () => onSuccess()
  })


  idPiece.addEventListener("click", () => { if (driverObj.getActiveIndex() == 0) driverObj.moveNext() }, { once: true})
  driverObj.drive() 

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    cancel();
    onCancelerSuccess();
  };
}

export const movePieceGuide = (onError, onSuccess) => {
  const portLeft = document.querySelector(".board-port[data-direction='left']")
  const portRight = document.querySelector(".board-port[data-direction='right']")
  const diagram = document.querySelector(".board-port-diagram")

  const diagramLeftPort = document.querySelector("svg.board-port-diagram g[data-direction='left']")
  const diagramRightPort = document.querySelector("svg.board-port-diagram g[data-direction='right']")

  const idPiece = document.querySelector("div[data-available-piece='id-piece']")
  const board = document.querySelector("#board-component")
  const puzzle = document.querySelector("#puzzle-component")
  const location01 = document.querySelector("div[data-location='(0,1)']")
  const location11 = document.querySelector("div[data-location='(1,1)']")

  const driverObj = abedDriver({
    popoverClass: 'driverjs-theme',
    steps: [
      { element: portLeft,
        popover: { description: "See this arrow here? It's a port that sends a signal into the board" }
      },
      { element: portRight,
        popover: { description: "Here's another port, but this one sends a signal out of the board. Hmm..." }
      },
      { element: board,
        popover:
        { description: "Drag this piece to the square below",
          showButtons: []
        },
        onHighlighted: () => {
          new MutationObserver((mutationList, observer) => {
            driverObj.moveNext()
            observer.disconnect()
          }).observe(diagramLeftPort, { attributes: true })
        }
      },
      { element: diagram,
        popover: { description: "Hey look at that! The LEFT arrow turned green!" }
      },
      { element: puzzle,
        popover: 
        { description: "Alright... now we're getting somewhere. Add another piece and drag it to the RIGHT side.",
          showButtons: []
        },
        onHighlightStarted: () =>
          new MutationObserver((mutationList, observer) => {
            driverObj.moveNext()
            observer.disconnect()
          }).observe(diagramRightPort, { attributes: true })
      },
      { element: diagram,
        popover: { description: "Hey look at that! The RIGHT arrow turned green! All the ports are connected to pieces!" }
      },
      { element: location11,
        popover: { description: "So now we just gotta fill in that gap..." }
      }
    ],
    onDestroyed: () => onSuccess()
  })


  
  driverObj.drive() 
  return function (cancelError, onCancelerError, onCancelerSuccess) {
    cancel()
    onCancelerSuccess()
  }
}


export const runTestsGuide = (onError, onSuccess) => {
  const portLeft = document.querySelector(".board-port[data-direction='left']")
  const portRight = document.querySelector(".board-port[data-direction='right']")
  const diagram = document.querySelector(".board-port-diagram")

  const diagramLeftPort = document.querySelector("svg.board-port-diagram g[data-direction='left']")
  const diagramRightPort = document.querySelector("svg.board-port-diagram g[data-direction='right']")

  const idPiece = document.querySelector("div[data-available-piece='id-piece']")
  const board = document.querySelector("#board-component")
  const puzzle = document.querySelector("#puzzle-component")

  const completionStatus = document.querySelector("div.completion-status")
  const location11 = document.querySelector("div[data-location='(1,1)']")



  const driverObj = abedDriver({
    popoverClass: 'driverjs-theme',
    steps: [
      { element: completionStatus,
        popover: {
          description: "Press 'Run Tests' to see if the level is solved",
          showButtons: []
        },
        onHighlightStarted: () => {
          new MutationObserver((mutationList, observer) => {
            mutationList.forEach(record => {
              switch (completionStatus.dataset.completionStatus) {
                case "failed-test-case":
                  observer.disconnect()
                  driverObj.moveNext() 
                  break;
                case "completed":
                  observer.disconnect()
                  driverObj.destroy()
                  break;
                default: break;
              }
            })
          }).observe(completionStatus, { attributes: true})
        }
      },
      { element: puzzle,
        popover: {
          description: "Your tests have failed! Add a piece to the center of the board to connect the LEFT port to the RIGHT port",
          showButtons: []
        },
        onHighlightStarted: () => {
          new MutationObserver((mutationList, observer) => {
            mutationList.forEach(record => {
              record.addedNodes.forEach(element => {
                if (element.classList.contains("piece-component")) {
                  driverObj.movePrevious()
                  observer.disconnect()
                }
              })
            })
          }).observe(location11, { childList: true})
        }
      }
    ]
  })



  driverObj.drive() 
  return function(cancelError, onCancelerError, onCancelerSuccess) {
    cancel()
    onCancelerSuccess()
  }
}