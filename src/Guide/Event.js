import * as element from '../../src/Guide/Element.js';

export const pieceAdded = loc => (onError, onSuccess) => {
  console.log("added piece")
  const observer = new MutationObserver((mutationList, ob) => {
    for (const mutation of mutationList) {
      mutation.addedNodes.forEach(node => {
        const isPieceComponent = node.nodeType === Node.ELEMENT_NODE && node.classList.contains("piece-component")
        if (isPieceComponent) {
          onSuccess()
          ob.disconnect()
        }
      })
    }
  })

  observer.observe(element.locationAt(loc)(), {childList: true})

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    observer.disconnect()
    onCancelerSuccess()
  };
}

export const pieceRemoved = loc => (onError, onSuccess) => {
  const observer = new MutationObserver((mutationList, ob) => {
    for (const mutation of mutationList) {
      mutation.removedNodes.forEach(node => {
        const isPieceComponent = node.nodeType === Node.ELEMENT_NODE && node.classList.contains("piece-component")
        if (isPieceComponent) {
          console.log(node)
          ob.disconnect()
          onSuccess()
        }
      })
    }
  })

  observer.observe(element.locationAt(loc)(), {childList: true})

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    observer.disconnect()
    onCancelerSuccess()
  };
}

const completionStatusEvent = (completionStatus) => (onError, onSuccess) => {
  const observer = new MutationObserver((mutationList, ob) => {
    for (const mutation of mutationList) {
      const status = mutation.target.getAttribute("data-completion-status")
      if (status == completionStatus) {
        onSuccess()
        ob.disconnect()
      }
    }
  })

  observer.observe(element.completionStatus(), {attributes: true})

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    observer.disconnect()
    onCancelerSuccess()
  };
}

export const portMismatch = completionStatusEvent("port-mismatch")

export const readyForTesting = completionStatusEvent("ready-for-testing")

export const runningTest = completionStatusEvent("running-test")

export const failedTestCase = completionStatusEvent("failed-test-case")

export const completed = completionStatusEvent("completed")