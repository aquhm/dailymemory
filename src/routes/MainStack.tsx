import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import DiaryScreen from "../screens/main/DiaryScreen"
import LobbyScreen from "../screens/main/LobbyScreen"
import NoticeScreen from "../screens/main/NoticeScreen"
import ProfileScreen from "../screens/main/ProfileScreen"
import SubscribeScreen from "../screens/main/SubscribeScreen"

const MainStack = () => {
  console.log("MainStack")

  const BottomTab = createBottomTabNavigator()
  return (
    <BottomTab.Navigator initialRouteName="Lobby" headerMode="none">
      <BottomTab.Screen name="Lobby" component={LobbyScreen} />
      <BottomTab.Screen name="Diary" component={DiaryScreen} />
      <BottomTab.Screen name="Subscribe" component={SubscribeScreen} />
      <BottomTab.Screen name="Notice" component={NoticeScreen} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} />
    </BottomTab.Navigator>
  )
}

export default MainStack
