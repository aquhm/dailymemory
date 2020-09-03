import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from "react-native";
import Images from "../../constants/Images";
import { RoundedIcon } from "../../components/RoundedIcon";
import { RectButton } from "react-native-gesture-handler";

export interface DrawerEntryProps {
  icon: string;
  color: string;
  screen: string;
  label: string;
}

export const DrawerEntry = ({ icon, color, screen, label }: DrawerEntryProps) => {
  return (
    <RectButton style={{ marginVertical: 10, borderRadius: 12 }}>
      <View style={styles.container}>
        <RoundedIcon name={icon} size={36} iconScale={0.5} backgroundColor={color} color={"white"} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
  },
});
