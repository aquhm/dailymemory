import React from "react";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { CompositeNavigationProp } from "@react-navigation/native";

import DiaryScreen from "../screens/main/DiaryScreen";
import LobbyScreen from "../screens/main/LobbyScreen";
import NoticeScreen from "../screens/main/NoticeScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import SubscribeScreen from "../screens/main/SubscribeScreen";

import { RootStackNavigationProps } from "./RootStack";

type MainStackParamList = {
  default: undefined;
  Lobby: undefined;
  Diary: undefined;
  Subscribe: undefined;
  Notice: undefined;
  Profile: undefined;
};

type MainNavigationProps<T extends keyof MainStackParamList = "default"> = BottomTabNavigationProp<
  MainStackParamList,
  T
>;

type MainStackNavigationProps<T extends keyof MainStackParamList = "default"> = CompositeNavigationProp<
  MainNavigationProps<T>,
  RootStackNavigationProps<"MainStack">
>;

const MainStack = () => {
  console.log("MainStack");

  const BottomTab = createBottomTabNavigator<MainStackParamList>();

  return (
    <BottomTab.Navigator initialRouteName="Lobby">
      <BottomTab.Screen name="Lobby" component={LobbyScreen} />
      <BottomTab.Screen name="Diary" component={DiaryScreen} />
      <BottomTab.Screen name="Subscribe" component={SubscribeScreen} />
      <BottomTab.Screen name="Notice" component={NoticeScreen} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
};

export { MainStack, MainStackNavigationProps, MainStackParamList };
