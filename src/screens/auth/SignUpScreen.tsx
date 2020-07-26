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

import { AuthStackNavigationProps } from "../../routes/AuthStack"

const { height, width } = Dimensions.get("window")

interface Props {
  navigation: AuthStackNavigationProps<"SignUp">
}

type State = {
  name: string
  email: string
  password: string
  confirmPassword: string
  trySignUp: boolean
}

class SignUpScreen extends React.Component<Props, State> {
  state: State = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    trySignUp: false,
  }

  constructor(props: Props) {
    super(props)

    console.log("SignUpScreen")
  }

  componentWillMount() {
    //Firebase.setAuthStateChange(this.onAuthStateChanged)
  }

  onAuthStateChanged = (user: any) => {
    console.log("onAuthStateChanged user = " + JSON.stringify(user))

    if (user !== null) {
      console.log(
        "SignUpScreen create user succeed user = " + JSON.stringify(user)
      )

      const { emailVerified } = user
      const navigate = this.props.navigation.navigate

      if (emailVerified == false) {
        navigate("SignIn")
      } else {
        navigate("MainStack")
      }
    } else {
    }
  }

  onChangeName = (name: string) => this.setState({ name: name })
  onChangeEmail = (email: string) => this.setState({ email: email })
  onChangePassword = (password: string) => this.setState({ password: password })
  onChangeConfirmPassword = (confirmPassword: string) =>
    this.setState({ confirmPassword: confirmPassword })

  isEmailValid = () => {
    const { email } = this.state

    const reg: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    return reg.test(email.toLowerCase())
  }

  onVertify = () => {
    const name = _.isEmpty(this.state.name)
    const email = _.isEmpty(this.state.email)
    const password = _.isEmpty(this.state.password)
    const confirmPassword = _.isEmpty(this.state.confirmPassword)

    return (
      name ||
      email ||
      password ||
      confirmPassword ||
      password !== confirmPassword
    )
  }

  onSubmit = () => {
    Firebase.Instance.setAuthStateChange(this.onAuthStateChanged)

    const { name, email, password } = this.state
    const navigate = this.props.navigation.navigate

    console.log("onSubmit() name = " + name + email + password)

    if (this.isEmailValid() === false) {
      Alert.alert("Email is Not Correct")
      return
    }

    const sendEmailVerify = true
    Firebase.Instance.createUserWithEmailAndPassword(
      email,
      password,
      name,
      sendEmailVerify
    )
      ?.then(() => {
        Alert.alert("Please verify your email")
        //if (sendEmailVerify) {
        //  navigation.navigate("SignIn")
        //}
      })
      .catch((error: any) => {
        Alert.alert("error = " + error)
        console.log("error = " + error)
      })
  }

  render() {
    const { navigation } = this.props
    const { name, email, password, confirmPassword } = this.state
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
              <Text style={styles.inputTitle}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="name"
                placeholderTextColor="#9a73ef"
                value={name}
                onChangeText={this.onChangeName}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email"
                placeholderTextColor="#9a73ef"
                value={email}
                onChangeText={this.onChangeEmail}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#9a73ef"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={this.onChangePassword}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#9a73ef"
                secureTextEntry
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={this.onChangeConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={[{ marginTop: 32 }, styles.button]}
              onPress={this.onSubmit}
              disabled={this.onVertify()}
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
