import React from "react";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import { CompositeNavigationProp } from "@react-navigation/native";

import LoginScreen from "../screens/auth/LoginScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

import { RootStackNavigationProps } from "./RootStack";

type AuthStackParamList = {
  default: undefined;
  Login: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

type AuthNavigationProps<T extends keyof AuthStackParamList = string> = StackNavigationProp<AuthStackParamList, T>;

type AuthStackNavigationProps<T extends keyof AuthStackParamList = string> = CompositeNavigationProp<
  AuthNavigationProps<T>,
  RootStackNavigationProps<"AuthStack">
>;

const AuthStack = () => {
  console.log("AuthStack");

  const Stack = createStackNavigator<AuthStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export { AuthStack, AuthStackParamList, AuthStackNavigationProps };
