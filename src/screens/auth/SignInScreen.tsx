import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native"

import { Formik, useFormik } from "formik"
import * as Yup from "yup"

import { AuthStackNavigationProps } from "../../routes/AuthStack"

import Firebase from "../../Firebase"
import * as _ from "lodash"

import { AuthHeader } from "../../components/Header"
import Theme from "../../constants/Styles"

import LoginTextInput from "../../components/Form/TextInput"

const { width } = Dimensions.get("window")

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Too Short!")
    .max(16, "Too Long!")
    .required("Required"),
})

interface Props {
  navigation: AuthStackNavigationProps<"SignIn">
}

type State = {
  email: string
  password: string
  disabled: boolean
  isFocused: boolean
}

class SignInScreen extends React.Component<Props, State> {
  state: State = {
    email: "",
    password: "",
    disabled: true,
    isFocused: false,
  }

  constructor(props: Props) {
    super(props)
    console.log("SignInScreen")
  }

  handleInputFocus = () => this.setState({ isFocused: true })

  handleInputBlur = () => {
    this.setState({ isFocused: false })
    this.SignInCondition()
  }

  onChangeEmail = (email: string): void => {
    this.setState({ email: email })
    this.SignInCondition()
  }
  onChangePassword = (password: string) => {
    this.setState({ password: password })
    this.SignInCondition()
  }

  SignInCondition = () => this.setState({ disabled: this.verify() === false })

  private verify = (): boolean => {
    const { email, password } = this.state
    const _email = _.isEmpty(email)
    const _password = _.isEmpty(password)

    return _email === false && _password === false
  }

  onAuthStateChanged = (user: any) => {
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

  onSignIn = async () => {
    const { email, password } = this.state

    console.log("OnPress onSignIn email = " + email + " " + password)

    if (this.verify() == false) {
      Alert.alert("Email is Not Correct")
      return
    }

    await Firebase.Instance.Login(
      email,
      password,
      this.onAuthStateChanged
    )?.catch((error) => {
      Alert.alert("SignIn Fail " + error)
    })
  }

  onSignUp = () => {
    this.props.navigation.navigate("SignUp")
  }

  isValid = (email: boolean, password: boolean) => {
    console.log("email = " + email + " password = " + password)
  }

  render() {
    return (
      <>
        <AuthHeader
          title="Sign In"
          backAction={() => {
            this.props.navigation.goBack()
          }}
        />

        <Formik
          validationSchema={SignInSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, actions) => {
            actions.setSubmitting(true)
            // same shape as initial values
            console.log(values)
            console.log("여기")
            actions.setSubmitting(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <View style={styles.container}>
              <View style={styles.form}>
                <View style={{ marginTop: 16 }}>
                  <LoginTextInput
                    title="Email"
                    icon="mail"
                    touched={touched.email}
                    error={errors.email}
                    placeholder="Enter your Email"
                    placeholderTextColor={Theme.COLOR.INPUT}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <LoginTextInput
                    title="Password"
                    icon="lock"
                    touched={touched.password}
                    error={errors.password}
                    placeholder="Enter your Password"
                    placeholderTextColor={Theme.COLOR.INPUT}
                    secureTextEntry
                    autoCapitalize="none"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    { marginTop: 32 },
                    errors.email == undefined && errors.password == undefined
                      ? styles.button
                      : styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  //</View>disabled={this.state.disabled}
                >
                  <Text style={{ color: "#ffffff", fontWeight: "400" }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
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
          )}
        </Formik>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  form: {
    width: width * 0.8,
    marginBottom: 24,

    //justifyContent: "center",
    //alignContent: "center",
    //alignItems: "center",
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
