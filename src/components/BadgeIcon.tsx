import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

export enum DirectionType {
  LeftTop,
  LeftBottom,
  RightTop,
  RightBottom,
}

interface BadgeIconProps {
  size: number;
  name: string;
  color?: string;
  direction: DirectionType;
}

const BadgeIcon = ({ size, name, color, direction }: BadgeIconProps) => {
  const setDirectoin = (type: DirectionType) => {
    switch (type) {
      case DirectionType.LeftTop:
        return { left: 0, top: 0 };
      case DirectionType.LeftBottom:
        return { left: 0, bottom: 0 };
      case DirectionType.RightTop:
        return { right: 0, top: 0 };
      case DirectionType.RightBottom:
        return { right: 0, bottom: 0 };
      default:
        return { left: 0, top: 0, right: 0, bottom: 0 };
    }
  };

  return (
    <View
      style={[
        setDirectoin(direction),
        { height: size, width: size, borderRadius: size / 2, backgroundColor: color },
        styles.badgeIcon,
      ]}
    >
      <Icon {...{ name }} />
    </View>
  );
};

const styles = StyleSheet.create({
  badgeIcon: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 2,
    backgroundColor: "#FFAADD",
  },
});

BadgeIcon.defaultProps = {
  color: "#FFAADD",
  direction: DirectionType.RightBottom,
};

export default BadgeIcon;
