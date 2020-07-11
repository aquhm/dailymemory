import React, { useState } from "react"
//import { withNavigation } from "react-navigation"
import { useFocusEffect } from "@react-navigation/native"

import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
  exitSecondTimeAlert,
  exitAlert,
} from "../utility/AndroidBackButtonHandler"

/*
class HandleBack extends React.Component {
  componentDidMount() {
    console.log(this.constructor.name + componentDidMount.someme)

    this.focusListener = this.props.navigation.addListener("focus", this.onBack)
    this.blurListener = this.props.navigation.addListener("blur", this.onBack)
  }

  onBack = () => {
    return this.props.onBack()
  }

  componentWillUnmount() {
    this.focusListener.remove()
    this.blurListener.remove()
  }

  render() {
    return this.props.children
  }
}
*/

const HandleBack = (props) => {
  const [backHandler, setBackHandler] = useState(null)

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      if (backHandler !== null) backHandler.remove()

      console.log("HandleBack backHandler = " + backHandler)
      console.log("HandleBack " + "mount")
      setBackHandler(handleAndroidBackButton(exitSecondTimeAlert))
      console.log("HandleBack backHandler = " + backHandler)

      return () => {
        console.log("HandleBack " + "unmount")
        console.log("HandleBack backHandler = " + backHandler)
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setBackHandler(null)
        removeAndroidBackButtonHandler()
        console.log("HandleBack backHandler = " + backHandler)
      }
    }, [])
  )

  return null
}

export default HandleBack
//export default withNavigation(HandleBack)
