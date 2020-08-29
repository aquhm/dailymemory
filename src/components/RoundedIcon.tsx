import React from "react";
import { View, StyleSheet } from "react-native";

import { Feather as Icon } from "@expo/vector-icons";

interface RoundedIconProps {
  name: string;
  size: number;
  color: string;
  backgroundColor: string;
}

const RoundedIcon = ({ name, size, color, backgroundColor }: RoundedIconProps) => {
  const iconSize = size * 0.7;
  return (
    <View
      style={[{ height: size, width: size, borderRadius: size / 2 }, styles.iconContainer]}
      {...{ backgroundColor }}
    >
      <View style={{ height: iconSize, width: iconSize }}>
        <Icon style={styles.icon} {...{ name, color }} size={iconSize} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RoundedIcon;
