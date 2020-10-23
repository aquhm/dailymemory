import React from "react";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import DiaryViewScreen from "../screens/diary/DiaryViewScreen";
import { DiaryRecord } from "../shared/records";
import LobbyScreen from "../screens/home/LobbyScreen";

export type LobbyStackParamList = {
  Lobby: undefined;
  DiaryView: {
    diary: DiaryRecord;
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
    </Stack.Navigator>
  );
};

export default LobbyNavigator;
