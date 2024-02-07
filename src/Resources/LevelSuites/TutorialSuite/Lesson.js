import { availablePiece, locationAt, boardElement } from "../../src/Guide/Elements.js";
import { moveNextOnClick } from "../../src/Guide/Lesson.js";
//import { abedDriver } from "../../src/Guide/Lesson.js"
import { driver } from "driver.js";


export const addPieceLesson = () => {
  const idPiece = availablePiece("id-piece")()
  const location00 = locationAt({x: 0, y: 0})() 
  console.log(location00)

  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    steps: [
      { element: idPiece,
        popover:
          { description: "Click on the piece"
          , showButtons: []
          },
        onHighlighted: () => moveNextOnClick(driverObj, idPiece)
      },
      { element: location00,
        popover: { description: "The piece is then added to the first empty slot on the board" }
      }
    ],
  })

  driverObj.drive() 
}

export const movePieceLesson = () => {

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

export const removePieceLessonUnsafe = loc => () => {
  location = locationAt(loc)()

  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    steps: [{
        element: location,
        popover: {
          description: "Pieces can be removed by dragging them outside the board"
        }
      }, { 
        element: boardElement(),
        popover: {
          description: "Drag the piece outside the board",
          showButtons: []
        },
        onHighlightStarted: () => {
          new MutationObserver((mutationList, observer) => {
            mutationList.forEach(record => {
              record.removedNodes.forEach((node) => {
                driverObj.moveNext()
                observer.disconnect()
              })
            })
          }).observe(completionStatus, { childList: true})
        }

        
      }

    ]
  })


  driverObj.drive()
}

export const rotatePieceLesson = loc => () => {
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
      }
    ]
  })

  driverObj.drive() 
}

export const runTestsLesson = () => {

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