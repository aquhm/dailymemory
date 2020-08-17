import React, { createRef } from "react";
import { View, Text, StyleSheet, TextInput as RNTextInput, TouchableOpacity, Alert, Dimensions } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Formik } from "formik";
import * as Yup from "yup";

import Firebase from "../../Firebase";
import { AuthHeader } from "../../components/Header";
import Theme from "../../constants/Styles";

import * as _ from "lodash";

import { AuthStackNavigationProps } from "../../routes/AuthStack";

import LoginTextInput from "../../components/Form/TextInput";

const { width } = Dimensions.get("window");

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(5, "Too Short!").max(16, "Too Long!").required("Required"),

  email: Yup.string().email("Invalid email").required("Required"),

  password: Yup.string().min(8, "Too Short!").max(16, "Too Long!").required("Required"),

  confirmPassword: Yup.string()
    .equals([Yup.ref("password")], "password don't match")
    .required("Required"),
});

interface Props {
  navigation: AuthStackNavigationProps<"SignUp">;
}

type State = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  trySignUp: boolean;
};

class SignUpScreen extends React.Component<Props, State> {
  state: State = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    trySignUp: false,
  };

  passwordRef = createRef<typeof LoginTextInput>();
  confirmPasswordRef = createRef<typeof LoginTextInput>();
  emailRef = createRef<typeof LoginTextInput>();

  constructor(props: Props) {
    super(props);

    console.log("SignUpScreen");
  }

  onAuthStateChanged = (user: any) => {
    console.log("onAuthStateChanged user = " + JSON.stringify(user));

    if (user !== null) {
      console.log("SignUpScreen create user succeed user = " + JSON.stringify(user));

      Alert.alert("create user success.");

      //const { emailVerified } = user

      //if (emailVerified == false) {
      //        Alert.alert("Please verify your email.")
      //      } else {
      //        Alert.alert("Please verify your email.")
      //this.props.navigation.navigate("MainStack")
      //      }
    } else {
      Alert.alert("create user fail.");
    }
  };

  onSignUp = async (name: string, email: string, password: string) => {
    const result = await Firebase.Instance.SighUp(name, email, password, this.onAuthStateChanged)
      ?.then(() => {
        return true;
      })
      .catch((error) => {
        Alert.alert("SignIn Fail " + error);
        return false;
      });
    return result;
  };

  render() {
    const { navigation } = this.props;
    return (
      <>
        <AuthHeader
          title="Sign Up"
          backAction={() => {
            navigation.goBack();
          }}
        />
        <Formik
          validationSchema={SignUpSchema}
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          isInitialValid={false}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true);
            await this.onSignUp(values.name, values.email, values.password)
              .then(() => {
                console.log("onSignUp success");
                actions.setSubmitting(false);
              })
              .catch(() => {
                console.log("onSignUp fail");
                actions.setSubmitting(false);
              });
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
                    title="Name"
                    icon="user"
                    touched={touched.name}
                    error={errors.name}
                    placeholder="Enter your Name"
                    placeholderTextColor={Theme.COLOR.INPUT}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    autoCapitalize="none"
                    autoCompleteType="name"
                    returnKeyType="done"
                    returnKeyLabel="done"
                    onSubmitEditing={() => this.emailRef.current?.focus()}
                    defaultValue="kim"
                  />
                </View>

                <View style={{ marginTop: 32 }}>
                  <LoginTextInput
                    ref={this.emailRef}
                    title="Email"
                    icon="mail"
                    touched={touched.email}
                    error={errors.email}
                    placeholder="Enter your Email"
                    placeholderTextColor={Theme.COLOR.INPUT}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    returnKeyType="done"
                    returnKeyLabel="done"
                    onSubmitEditing={() => this.passwordRef.current?.focus()}
                    defaultValue="abc@naver.com"
                  />
                </View>

                <View style={{ marginTop: 32 }}>
                  <LoginTextInput
                    ref={this.passwordRef}
                    title="Password"
                    icon="lock"
                    touched={touched.password}
                    error={errors.password}
                    placeholder="Enter your Password"
                    placeholderTextColor={Theme.COLOR.INPUT}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCompleteType="password"
                    returnKeyType="done"
                    returnKeyLabel="done"
                    onSubmitEditing={() => this.confirmPasswordRef.current?.focus()}
                    defaultValue="11111111"
                  />
                </View>

                <View style={{ marginTop: 32 }}>
                  <LoginTextInput
                    ref={this.confirmPasswordRef}
                    title="Confirm Password"
                    icon="lock"
                    touched={touched.confirmPassword}
                    error={errors.confirmPassword}
                    placeholder="Enter your Confirm Password"
                    placeholderTextColor={Theme.COLOR.INPUT}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCompleteType="password"
                    returnKeyType="done"
                    returnKeyLabel="done"
                    onSubmitEditing={() => handleSubmit()}
                    defaultValue="11111111"
                  />
                </View>

                <TouchableOpacity
                  style={[{ marginTop: 32 }, isValid ? styles.button : styles.disabledButton]}
                  disabled={isSubmitting || !isValid}
                  onPress={handleSubmit}
                >
                  <Text style={{ color: "#ffffff", fontWeight: "400" }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </>
    );
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
});

export default SignUpScreen;
