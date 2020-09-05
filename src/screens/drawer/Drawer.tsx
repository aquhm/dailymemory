import React from "react";
import { Dimensions, View, Text, StyleSheet, ScrollView, ImageBackground, Image } from "react-native";

import DrawerItems from "../../constants/DrawerItems";
import { DrawerBg } from "../../constants/Images";
import ProfileRoundImage from "../../components/ProfileRoundImage";

import { DrawerEntry } from "./DrawerEntry";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;
const aspectRatio = 750 / 1125;
const height = DRAWER_WIDTH * aspectRatio;

const Drawer = () => {
  return (
    <ScrollView>
      <ImageBackground source={DrawerBg} style={styles.imageBackground}>
        {/*<Image source={require("../../../assets/temp_profil_img.jpg")} style={styles.profile} />*/}
        <ProfileRoundImage size={80} showEditIcon />
        <Text style={styles.name}>Aquhm</Text>
      </ImageBackground>

      <View style={styles.container}>
        {DrawerItems.map((item) => (
          <DrawerEntry key={item.screen} {...item} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    margin: 36,
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
