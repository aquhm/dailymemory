import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import DiaryScreen from "../screens/home/DiaryScreen";
import MapScreen from "../screens/map/MapScreen";

export type DiaryStackParamList = {
  Diary: undefined;
  Map: undefined;
};

export type DiaryStackNavigationProps<T extends keyof DiaryStackParamList> = StackNavigationProp<
  DiaryStackParamList,
  T
>;

const DiaryNavigator = () => {
  const Stack = createStackNavigator<DiaryStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Diary" headerMode="none">
      <Stack.Screen name="Diary" component={DiaryScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};

export default DiaryNavigator;
