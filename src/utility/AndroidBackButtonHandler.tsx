import { ToastAndroid, Alert, BackHandler } from "react-native"
import Firebase from "../Firebase"
import * as common from "./common"

let exitApp = false
let timeout = 0
let latestBackHandler = null
let backAction = null

const getLastestBackHandler = () => {
  return latestBackHandler
}

const handleAndroidBackButton = (callBack) => {
  common.getFunctionCallerName()

  backAction = () => {
    callBack()
    return true
  }

  latestBackHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  )

  return latestBackHandler
}

const removeAndroidBackButtonHandler = () => {
  common.getFunctionCallerName()
  latestBackHandler.remove()

  if (backAction !== null)
    BackHandler.removeEventListener("hardwareBackPress", backAction)

  console.log("removeAndroidBackButtonHandler = " + getLastestBackHandler())
}

const exitSecondTimeAlert = () => {
  if (!exitApp) {
    console.log("this.exitApp = " + exitApp)
    ToastAndroid.show("한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT)
    exitApp = true

    timeout = setTimeout(
      () => {
        exitApp = false
      },
      2 * 1000 // 2초
    )
  } else {
    clearTimeout(timeout)
    ToastAndroid.show("", 0)
    Firebase.signOut()

    BackHandler.exitApp() // 앱 종료
  }
}

const exitAlert = () => {
  Alert.alert("Confirm exit", "Do you want to quit the app?", [
    ({ text: "CANCEL", style: "cancel" },
    {
      text: "OK",
      onPress: () => {
        Firebase.signOut()
        BackHandler.exitApp()
      },
    }),
  ])
}

export {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
  exitSecondTimeAlert,
  exitAlert,
  getLastestBackHandler,
}
