import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native"

import Firebase from "../../Firebase"
import * as _ from "lodash"

import { AuthHeader } from "../../components/Header"
import Theme from "../../constants/Styles"

const { width, height } = Dimensions.get("window")

class SignInScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      disabled: true,
      isFocused: false,
    }

    console.log("SignInScreen")
  }

  isEmail = (email) => {
    const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

    return emailRegex.test(email)
  }

  handleInputFocus = () => this.setState({ isFocused: true })

  handleInputBlur = () => {
    this.setState({ isFocused: false })
    this.SignInCondition()
  }

  onChangeEmail = (email) => {
    this.setState({ email: email })
    this.SignInCondition()
  }
  onChangePassword = (password) => {
    this.setState({ password: password })
    this.SignInCondition()
  }

  SignInCondition = () => this.setState({ disabled: this.verify() === false })

  isEmailValid = () => {
    const { email } = this.state
    console.log("isEmailValid = " + email)

    if (_.isEmpty(email) === false) {
      console.log(" email valid = " + this.isEmail(email))

      if (this.isEmail(email) === false) {
        Alert.alert("Invalid Email")
        return false
      }
    }

    return true
  }

  isPasswordValid = () => {
    const { password } = this.state

    console.log("isPasswordValid = " + password + " " + String(password).length)

    //if (String(password).length < 8) {
    //  Alert.alert("Invalid password")
    //  return false
    //}

    return true
  }

  verify = () => {
    const { email, password } = this.state
    const _email = _.isEmpty(email)
    const _password = _.isEmpty(password)

    return _email === false && _password === false
  }

  onAuthStateChanged = (user) => {
    console.log("onAuthStateChanged user = " + JSON.stringify(user))

    if (user !== null) {
      console.log(
        "SignInScreen create user succeed user = " + JSON.stringify(user)
      )

      const { emailVerified } = user

      if (emailVerified == false) {
        Alert.alert("Please verify your email.")
      } else {
        this.props.navigation.navigate("MainStack")
      }
    } else {
    }
  }

  onSignIn = () => {
    Firebase.setAuthStateChange(this.onAuthStateChanged)

    const { email, password } = this.state

    console.log("OnPress onSignIn email = " + email + " " + password)

    if (this.verify == false) {
      Alert.alert("Email is Not Correct")
      return
    }

    if (this.isEmailValid === false) {
      Alert.alert("Email is Not Correct")
      return
    }

    Firebase.signInWithEmailAndPassword(email, password).catch((error) => {
      Alert.alert("SignIn Fail " + error)
    })
  }

  onSignUp = () => {
    this.props.navigation.navigate("SignUp")
  }

  render() {
    return (
      <>
        <AuthHeader
          navigation={this.props.navigation}
          title="Sign In"
          backAction={() => {
            this.props.navigation.goBack()
          }}
        />
        <View style={styles.container}>
          <View style={styles.form}>
            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email"
                placeholderTextColor={Theme.COLOR.INPUT}
                value={this.email}
                onEndEditing={this.isEmailValid}
                onChangeText={this.onChangeEmail}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor={Theme.COLOR.INPUT}
                secureTextEntry
                autoCapitalize="none"
                onEndEditing={this.isPasswordValid}
                value={this.password}
                onChangeText={this.onChangePassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              { marginTop: 32 },
              this.state.disabled ? styles.disabledButton : styles.button,
            ]}
            onPress={this.onSignIn}
            disabled={this.state.disabled}
          >
            <Text style={{ color: "#ffffff", fontWeight: "400" }}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: 24,
              alignItems: "center",
            }}
            onPress={this.onSignUp}
          >
            <Text
              style={{
                color: "#000",
                fontWeight: "100",
              }}
            >
              Create New Account?
            </Text>
            <Text
              style={{
                marginLeft: 6,
                color: "#E9446A",
                fontWeight: "600",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  form: {
    width: width * 0.8,
    marginBottom: 24,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 12,
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 16,
    color: "#161F3D",
  },
  button: {
    width: width * 0.6,
    marginHorizontal: 32,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.5,
    width: width * 0.6,
    marginHorizontal: 32,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default SignInScreen
