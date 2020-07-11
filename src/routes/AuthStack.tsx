import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/auth/LoginScreen"
import SignInScreen from "../screens/auth/SignInScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"

export type AuthStackParamList = {
  Login: undefined
  SignIn: undefined
  SignUp: undefined
}

const AuthStack_ = createStackNavigator<AuthStackParamList>();


const AuthStack = () => {
  console.log("AuthStack")

  const Stack = createStackNavigator()
  return (
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export default AuthStack
