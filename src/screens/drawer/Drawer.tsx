import React from "react";
import { Dimensions, View, Text, StyleSheet, ScrollView, ImageBackground, Image } from "react-native";

import { DrawerContentComponentProps, DrawerContentOptions } from "@react-navigation/drawer";

import DrawerItems from "../../constants/DrawerItems";
import { DrawerBg } from "../../constants/Images";
import ProfileRoundImage from "../../components/ProfileRoundImage";
import { DefaultProfileImage } from "../../constants/Images";

import { DrawerEntry } from "./DrawerEntry";

import { useObserver } from "mobx-react";

import { RootStore, useStores } from "../../stores";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;
const aspectRatio = 750 / 1125;
const height = DRAWER_WIDTH * aspectRatio;

interface DrawerProps {
  navigation: DrawerContentComponentProps<DrawerContentOptions>;
}

const Drawer = ({ ...props }) => {
  const useUserData = () => {
    const { rootStore } = useStores();

    return useObserver(() => ({
      imageProfileUri: rootStore.AuthStore.profileImageUri,
    }));
  };

  const { navigation } = props;
  const { imageProfileUri } = useUserData();

  return (
    <ScrollView>
      <ImageBackground source={DrawerBg} style={styles.imageBackground}>
        <ProfileRoundImage imageUri={imageProfileUri ?? DefaultProfileImage} size={80} showEditIcon />
        <Text style={styles.name}>Aquhm</Text>
      </ImageBackground>

      <View style={styles.container}>
        {DrawerItems.map((item) => (
          <DrawerEntry key={item.screen} {...item} onPress={() => navigation.navigate(item.screen)} />
        ))}
      </View>

      <View style={{ marginLeft: 36 }}>
        <DrawerEntry
          icon="log-out"
          color="orange"
          label="Logout"
          onPress={() =>
            RootStore.Instance.AuthStore.SignOut().then(() => {
              console.log("SignOut");
              navigation.navigate("Login");
            })
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    marginLeft: 36,
  },
  imageBackground: {
    width: undefined,
    padding: 16,
    paddingTop: 48,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  name: {
    color: "#000",
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 12,
  },
});

export { Drawer, DRAWER_WIDTH };
