import React from "react";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import DiaryScreen from "../screens/home/DiaryScreen";
import MapScreen from "../screens/map/MapScreen";
import DiaryViewScreen from "../screens/diary/DiaryViewScreen";
import { Diary } from "../stores/object";

export type DiaryStackParamList = {
  Diary: undefined;
  Map: undefined;
  DiaryView: {
    diary: Diary;
  };
};

export type DiaryStackNavigationProps<T extends keyof DiaryStackParamList> = StackNavigationProp<DiaryStackParamList, T>;

const DiaryNavigator = () => {
  const Stack = createStackNavigator<DiaryStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Diary" headerMode="none">
      <Stack.Screen name="Diary" component={DiaryScreen} />
      <Stack.Screen name="DiaryView" component={DiaryViewScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};

export default DiaryNavigator;
