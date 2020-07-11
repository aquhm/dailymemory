import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native"

import Firebase from "../../Firebase"
import { AuthHeader } from "../../components/Header"
import * as _ from "lodash"

const { height, width } = Dimensions.get("window")

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props)

    console.log("SignUpScreen")

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      trySignUp: false,
    }
  }

  componentWillMount() {
    //Firebase.setAuthStateChange(this.onAuthStateChanged)
  }

  onAuthStateChanged = (user) => {
    console.log("onAuthStateChanged user = " + JSON.stringify(user))

    if (user !== null) {
      console.log(
        "SignUpScreen create user succeed user = " + JSON.stringify(user)
      )

      const { emailVerified } = user

      if (emailVerified == false) {
        this.props.navigation.navigate("SignIn")
      } else {
        this.props.navigation.navigate("MainStack")
      }
    } else {
    }
  }

  onChangeName = (name) => this.setState({ name: name })
  onChangeEmail = (email) => this.setState({ email: email })
  onChangePassword = (password) => this.setState({ password: password })
  onChangeConfirmPassword = (confirmPassword) =>
    this.setState({ confirmPassword: confirmPassword })

  isEmailValid = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    return reg.test(String(this.email).toLowerCase)
  }

  vertify = () => {
    const name = _.isEmpty(this.name)
    const email = _.isEmpty(this.namemaile)
    const password = _.isEmpty(this.password)
    const confirmPassword = _.isEmpty(this.confirmPassword)

    return (
      name ||
      email ||
      password ||
      confirmPassword ||
      password !== confirmPassword
    )
  }

  onSubmit = () => {
    Firebase.setAuthStateChange(this.onAuthStateChanged)

    const { name, email, password } = this.state
    const { navigation } = this.props

    console.log("onSubmit() name = " + name + email + password)

    if (this.isEmailValid === false) {
      Alert.alert("Email is Not Correct")
      return
    }

    const sendEmailVerify = true
    Firebase.createUserWithEmailAndPassword(
      email,
      password,
      name,
      sendEmailVerify
    )
      .then(() => {
        Alert.alert("Please verify your email")
        //if (sendEmailVerify) {
        //  navigation.navigate("SignIn")
        //}
      })
      .catch((error) => {
        Alert.alert("error = " + error)
        console.log("error = " + error)
      })
  }

  render() {
    const { navigation } = this.props
    return (
      <>
        <AuthHeader
          title="Sign Up"
          backAction={() => {
            navigation.goBack()
          }}
        />
        <View style={styles.container}>
          <View style={styles.form}>
            <View>
              <Text stype={styles.inputTitle}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="name"
                placeholderTextColor="#9a73ef"
                value={this.name}
                onChangeText={this.onChangeName}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <Text stype={styles.inputTitle}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email"
                placeholderTextColor="#9a73ef"
                value={this.email}
                onChangeText={this.onChangeEmail}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <Text stype={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#9a73ef"
                secureTextEntry
                autoCapitalize="none"
                value={this.password}
                onChangeText={this.onChangePassword}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <Text stype={styles.inputTitle}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#9a73ef"
                secureTextEntry
                autoCapitalize="none"
                value={this.confirmPassword}
                onChangeText={this.onChangeConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={[{ marginTop: 32 }, styles.button]}
              onPress={this.onSubmit}
              enable={this.vertify}
            >
              <Text style={{ color: "#ffffff", fontWeight: "400" }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
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

export default SignUpScreen
