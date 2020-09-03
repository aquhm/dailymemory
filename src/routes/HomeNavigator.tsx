import React from "react";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerNavigationProp, createDrawerNavigator } from "@react-navigation/drawer";

import { CompositeNavigationProp } from "@react-navigation/native";

import DiaryScreen from "../screens/main/DiaryScreen";
import LobbyScreen from "../screens/main/LobbyScreen";
import NoticeScreen from "../screens/main/NoticeScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import SubscribeScreen from "../screens/main/SubscribeScreen";

import SettingScreen from "../screens/main/SettingScreen";

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

/*
type HomeNavigationProps<T extends keyof HomeNavigatorBottomParamList> = CompositeNavigationProp<
  HomeNavigatorBottomProps<T>,
  RootStackNavigationProps<"MainStack">
>;
*/

type HomeNavigatorDrawerParamList = {
  Home: undefined;
  Setting: undefined;
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

const HomeNavigator = () => {
  return (
    //<Drawer.Navigator drawerContent={(props) => <HomeDrawer {...props} />}>
    <Drawer.Navigator drawerContent={DrawerContent} drawerStyle={{ width: DRAWER_WIDTH }}>
      <Drawer.Screen name="home" component={HomeBottomNavigator} />
      <Drawer.Screen name="setting" component={SettingScreen} />
    </Drawer.Navigator>
  );
};

export { HomeNavigator, HomeNavigationProps, HomeNavigationDrawProps };
