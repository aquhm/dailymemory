import React from "react";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerNavigationProp, createDrawerNavigator } from "@react-navigation/drawer";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";

import { CompositeNavigationProp } from "@react-navigation/native";

import DiaryScreen from "../screens/home/DiaryScreen";
import LobbyScreen from "../screens/home/LobbyScreen";
import NoticeScreen from "../screens/home/NoticeScreen";
import SubscribeScreen from "../screens/home/SubscribeScreen";

import ProfileNavigator from "./ProfileNavigator";
import DiaryNavigator from "./DiaryNavigator";
import UserInformationNavigator from "./UserInformationNavigator";

import SettingScreen from "../screens/home/SettingScreen";

import { MaterialCommunityIcons, Entypo, FontAwesome } from "@expo/vector-icons";

import { Drawer as DrawerContent, DRAWER_WIDTH } from "../screens/drawer/Drawer";
import { DiaryRecord } from "../shared/records";

type HomeNavigatorBottomParamList = {
  Lobby: undefined;
  Diary: undefined;
  Subscribe: undefined;
  Notice: undefined;
  UserInformation: undefined;
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

type DiaryNavigatorStackParamList = {
  Diary: undefined;
  DiaryView: {
    diary: DiaryRecord;
  };
  Map: undefined;
};

type DiaryNavigatorStackProps<T extends keyof DiaryNavigatorStackParamList> = StackNavigationProp<
  DiaryNavigatorStackParamList,
  T
>;

type HomeNavigationProps<
  T1 extends keyof HomeNavigatorDrawerParamList,
  T2 extends keyof HomeNavigatorBottomParamList
> = CompositeNavigationProp<HomeNavigatorDrawerProps<T1>, HomeNavigatorBottomProps<T2>>;

type DiaryNavigationProps<
  T1 extends keyof DiaryNavigatorStackParamList,
  T2 extends keyof HomeNavigatorBottomParamList
> = CompositeNavigationProp<DiaryNavigatorStackProps<T1>, HomeNavigatorBottomProps<T2>>;

type HomeNavigationDrawProps<T extends keyof HomeNavigatorDrawerParamList> = HomeNavigatorDrawerProps<T>;

const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator<HomeNavigatorBottomParamList>();

const HomeBottomNavigator = () => {
  return (
    <BottomTab.Navigator initialRouteName="Lobby">
      <BottomTab.Screen
        name="Lobby"
        component={LobbyScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <BottomTab.Screen
        name="Diary"
        component={DiaryNavigator}
        options={{
          tabBarLabel: "Diary",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Subscribe"
        component={SubscribeScreen}
        options={{
          tabBarLabel: "Subscribe",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bookmark-multiple" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Notice"
        component={NoticeScreen}
        options={{
          tabBarLabel: "Notice",
          tabBarIcon: ({ color, size }) => <Entypo name="sound" color={color} size={size} />,
        }}
      />
      <BottomTab.Screen
        name="UserInformation"
        component={UserInformationNavigator}
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" color={color} size={size} />,
        }}
      />
    </BottomTab.Navigator>
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

export { HomeNavigator, HomeBottomNavigator, HomeNavigationProps, HomeNavigationDrawProps, DiaryNavigatorStackProps };
