import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from "react-native";
import { RoundedIcon } from "../../components/RoundedIcon";
import { RectButton } from "react-native-gesture-handler";

export interface DrawerEntryProps {
  icon: string;
  iconSize: number;
  color: string;
  label: string;
  onPress?: () => void;
}

export const DrawerEntry = ({ icon, iconSize, color, label, onPress }: DrawerEntryProps) => {
  return (
    <RectButton style={{ marginVertical: 10, borderRadius: 12 }} {...{ onPress }}>
      <View style={styles.container}>
        <RoundedIcon name={icon} size={iconSize} iconScale={0.5} backgroundColor={color} color={"white"} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </RectButton>
  );
};

DrawerEntry.defaultProps = {
  iconSize: 36,
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
