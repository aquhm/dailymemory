import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack"
import { AuthStack } from "./AuthStack"
import { MainStack } from "./MainStack"

export type RootStackParamList = {
  default: undefined
  AuthStack: undefined
  MainStack: undefined
}

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = "default"
> = StackNavigationProp<RootStackParamList, T>

const RootStack = () => {
  console.log("AppContainer")

  const Stack = createStackNavigator<RootStackParamList>()

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthStack" headerMode="none">
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="MainStack" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootStack
