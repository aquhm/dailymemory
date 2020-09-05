import React from "react";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerNavigationProp, createDrawerNavigator } from "@react-navigation/drawer";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import { CompositeNavigationProp } from "@react-navigation/native";

import DiaryScreen from "../screens/home/DiaryScreen";
import LobbyScreen from "../screens/home/LobbyScreen";
import NoticeScreen from "../screens/home/NoticeScreen";
import ProfileScreen from "../screens/home/ProfileScreen";
import SubscribeScreen from "../screens/home/SubscribeScreen";

import SettingScreen from "../screens/home/SettingScreen";

import { Drawer as DrawerContent, DRAWER_WIDTH } from "../screens/drawer/Drawer";

import { RootStackNavigationProps } from "./AppNavigator";

type HomeNavigatorBottomParamList = {
  Lobby: undefined;
  Diary: undefined;
  Subscribe: undefined;
  Notice: undefined;
  Profile: undefined;
  Default: undefined;
};

type HomeNavigatorBottomProps<T extends keyof HomeNavigatorBottomParamList> = BottomTabNavigationProp<
  HomeNavigatorBottomParamList,
  T
>;

type HomeNavigatorDrawerParamList = {
  Home: undefined;
  Setting: undefined;
  Profile: undefined;
};

type HomeNavigatorDrawerProps<T extends keyof HomeNavigatorDrawerParamList> = DrawerNavigationProp<
  HomeNavigatorDrawerParamList,
  T
>;

type HomeNavigationProps<
  T1 extends keyof HomeNavigatorDrawerParamList,
  T2 extends keyof HomeNavigatorBottomParamList
> = CompositeNavigationProp<HomeNavigatorDrawerProps<T1>, HomeNavigatorBottomProps<T2>>;

type HomeNavigationDrawProps<T extends keyof HomeNavigatorDrawerParamList> = HomeNavigatorDrawerProps<T>;

const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator<HomeNavigatorBottomParamList>();

const HomeBottomNavigator = () => {
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

const ProfileNavigator = () => {
  const ProfileStack = createStackNavigator();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

const SettingNavigator = () => {
  const ProfileStack = createStackNavigator();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

const HomeNavigator = () => {
  return (
    //<Drawer.Navigator drawerContent={(props) => <HomeDrawer {...props} />}>
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} drawerStyle={{ width: DRAWER_WIDTH }}>
      <Drawer.Screen name="Home" component={HomeBottomNavigator} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Profile" component={ProfileNavigator} />
    </Drawer.Navigator>
  );
};

export { HomeNavigator, HomeNavigationProps, HomeNavigationDrawProps };
