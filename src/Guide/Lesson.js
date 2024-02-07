import { driver } from "driver.js";
import "./Elements.js";


export const abedDriver = function(config) {
  config.allowKeyboardControl = false
  driverObj = driver(config)
  return driverObj
}

export const moveNextOnClick = (driverObj, element) => {
  element.addEventListener(
    "click",
    () => driverObj.moveNext(),
    { once: true}
  )

}