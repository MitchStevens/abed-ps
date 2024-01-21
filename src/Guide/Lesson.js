import { driver } from "driver.js";
import "Elements.js";


abedDriver = function(config) {
  config.allowKeyboardControl = false
  driverObj = driver(config)
  driverObj.moveNextOnClick = element => () => element.addEventListener("click", () => driverObj.moveNext(), { once: true})
  return driverObj
}
