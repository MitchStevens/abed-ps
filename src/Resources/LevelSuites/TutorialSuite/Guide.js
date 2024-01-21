import { availablePiece, locationAt } from "../../../Guide/Elements"


export const addPieceGuide = () => {
  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    steps: [
      { element: availablePiece("id-piece")(),
        popover:
          { description: "Click on the piece"
          , showButtons: []
          },
        onHighlighted: driverObj.moveNextOnClick(idPiece)
      },
      { element: locationAt(0,0)(),
        popover: { description: "The piece is then added to the first empty slot on the board" }
      }
    ],
  })

  driverObj.drive() 
}

export const movePieceGuide = () => {

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
    ]
  })

  driverObj.drive() 
}


export const runTestsGuide = () => {

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
}