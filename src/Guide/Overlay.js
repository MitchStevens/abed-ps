export const delayUntilClicked_ = (element) => (onError, onSuccess) => {
  const onClick = (event) => { onSuccess() }
  const options = { once: true }
  element.addEventListener( "click", onClick, options )

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    element.removeEventListener("click", onClick, options )
    onCancelerSuccess()
  };
}

export const withDescription_ = annotation => description => () => {
  fontSize = 36
  //var svg = annotation._svg ///document.getElementsByClassName("rough-annotation")[0]

  for (var i = 0; i < Math.min(3, description.length); i++) {
    const newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
    newElement.appendChild(document.createTextNode(description[i]))

    newElement.setAttribute("x", (annotation._lastSizes[0].x + annotation._lastSizes[0].w + 15).toString())
    newElement.setAttribute("y", (annotation._lastSizes[0].y + fontSize * (i+1)).toString())
    newElement.setAttribute("font-size", fontSize + "px")

    annotation._svg.appendChild(newElement);
  }
}
