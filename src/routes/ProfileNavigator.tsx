import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/profile/ProfileScreen";
import ProfileImageChangeScreen from "../screens/profile/ProfileImageChangeScreen";
import PhotoPickerScreen from "../screens/profile/PhotoPickerScreen";

export type ProfileStackParamList = {
  Profile: undefined;
  ProfileImageChange: undefined;
  PhotoPicker: undefined;
};

export type ProfileStackNavigationProps<T extends keyof ProfileStackParamList> = StackNavigationProp<
  ProfileStackParamList,
  T
>;

const ProfileNavigator = () => {
  const Stack = createStackNavigator<ProfileStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="none">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileImageChange" component={ProfileImageChangeScreen} />
      <Stack.Screen name="PhotoPicker" component={PhotoPickerScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
