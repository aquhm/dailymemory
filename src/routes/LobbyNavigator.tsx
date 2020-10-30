import React from "react";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import DiaryViewScreen from "../screens/diary/DiaryViewScreen";
import LobbyScreen from "../screens/home/LobbyScreen";
import UserInformationScreen from "../screens/user/UserInformationScreen";
import { Diary, User } from "../stores/object";

export type LobbyStackParamList = {
  Lobby: undefined;
  DiaryView: {
    diary: Diary;
  };
  UserInformation: {
    user: User;
  };
};

export type LobbyStackNavigationProps<T extends keyof LobbyStackParamList> = StackNavigationProp<LobbyStackParamList, T>;
export type LobbyStackRouteProps<T extends keyof LobbyStackParamList> = RouteProp<LobbyStackParamList, T>;

const LobbyNavigator = () => {
  const Stack = createStackNavigator<LobbyStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Lobby" headerMode="none">
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="DiaryView" component={DiaryViewScreen} />
      <Stack.Screen name="UserInformation" component={UserInformationScreen} />
    </Stack.Navigator>
  );
};

export default LobbyNavigator;
