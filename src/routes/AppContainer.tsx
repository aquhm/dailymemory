import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import AuthStack from "./AuthStack"
import MainStack from "./MainStack"

export interface RootStackParamList {
  AuthStack: undefined
  MainStack: undefined
}

const RootStack = createStackNavigator<RootStackParamList>();

/*
const AppContainer = () => {
  console.log("AppContainer")

  const Stack = createStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthStack" headerMode="none">
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="MainStack" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}*/

//export default AppContainer
