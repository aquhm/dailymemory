import React from "react";

import { RouteProp, NavigationContainer } from "@react-navigation/native";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import UserInformationScreen from "../screens/user/UserInformationScreen";
import MapScreen from "../screens/map/MapScreen";
import DiaryCreateScreen from "../screens/diary/DiaryCreateScreen";
import DiaryViewScreen from "../screens/diary/DiaryViewScreen";
import DiaryScreen from "../screens/home/DiaryScreen";

export type UserInformationStackParamList = {
  UserInformation: undefined;
  Setting: undefined;
  DiaryCreate: undefined;
  Diary: undefined;
  DiaryView: {
    diaryId: string;
  };
};

export type UserInformationStackNavigationProps<T extends keyof UserInformationStackParamList> = StackNavigationProp<
  UserInformationStackParamList,
  T
>;

export type UserInformationStackRouteProps<T extends keyof UserInformationStackParamList> = RouteProp<
  UserInformationStackParamList,
  T
>;

const UserInformationNavigator = () => {
  const Stack = createStackNavigator<UserInformationStackParamList>();

  return (
    <Stack.Navigator initialRouteName="UserInformation" headerMode="none">
      <Stack.Screen name="UserInformation" component={UserInformationScreen} />
      <Stack.Screen name="Setting" component={MapScreen} />
      <Stack.Screen name="DiaryCreate" component={DiaryCreateScreen} />
      <Stack.Screen name="Diary" component={DiaryScreen} />
      <Stack.Screen name="DiaryView" component={DiaryViewScreen} />
    </Stack.Navigator>
  );
};

export default UserInformationNavigator;
