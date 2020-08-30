import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";
import { AuthNavigator } from "./AuthNavigator";
import { HomeNavigator } from "./HomeNavigator";

export type RootStackParamList = {
  default: undefined;
  AuthStack: undefined;
  MainStack: undefined;
};

export type RootStackNavigationProps<T extends keyof RootStackParamList = "default"> = StackNavigationProp<
  RootStackParamList,
  T
>;

const AppNavigator = () => {
  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthStack" headerMode="none">
        <Stack.Screen name="AuthStack" component={AuthNavigator} />
        <Stack.Screen name="MainStack" component={HomeNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
