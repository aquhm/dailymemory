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

import { Formik, FormikHelpers } from "formik"
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

class SignInScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    console.log("SignInScreen")
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

  onSignIn = async (email: string, password: string) => {
    const result = await Firebase.Instance.Login(
      email,
      password,
      this.onAuthStateChanged
    )
      ?.then(() => {
        return true
      })
      .catch((error) => {
        Alert.alert("SignIn Fail " + error)
        return false
      })

    return result
  }

  onSignUp = () => {
    this.props.navigation.navigate("SignUp")
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
          isInitialValid={false}
          onSubmit={(values, actions) => {
            actions.setSubmitting(true)
            this.onSignIn(values.email, values.password)
              .then(() => {
                console.log("onSignIn success")
                actions.setSubmitting(false)
              })
              .catch(() => {
                console.log("onSignIn fail")
                actions.setSubmitting(false)
              })
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
            isValid,
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
                    isValid ? styles.button : styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting || !isValid}
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
