import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Feather as Icon } from "@expo/vector-icons";

interface RoundedIconProps {
  name: string;
  size: number;
  iconScale: number;
  color: string;
  backgroundColor: string;
}

const RoundedIcon = ({ name, size, iconScale, color, backgroundColor }: RoundedIconProps) => {
  const iconSize = size * iconScale;

  return (
    <View
      style={[{ height: size, width: size, borderRadius: size / 2 }, styles.iconContainer]}
      {...{ backgroundColor }}
    >
      <View style={{ height: iconSize, width: iconSize, alignItems: "center" }}>
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

RoundedIcon.defaultProps = {
  iconScale: 0.7,
};

export { RoundedIcon, RoundedIconProps };
