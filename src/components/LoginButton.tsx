import React from "react"
import {
  Alert,
  View,
  Text,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from "react-native"

class LoginButton extends React.Component {
  render() {
    return <View style={styles.container}></View>
  }
}

const styles = StyleSheet.create({
  container: {
    flext: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  buttonContainer: {
    flext: 1,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default LoginButton
