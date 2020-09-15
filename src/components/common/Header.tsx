import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoundedIconButton from "../RoundedIconButton";

export interface HeaderProps {
  left: {
    icon?: string;
    label?: string;
    onPress: () => void;
    visible: boolean;
  };

  right?: {
    icon?: string;
    label?: string;
    onPress: () => void;
    visible: boolean;
  };

  title?: string;
  color?: string;
}

const Header = ({ left, right, title, color }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  const renderLeftItem = () => {
    if (left == null || left.visible == false) return;

    if (left.icon != null) {
      return (
        <RoundedIconButton
          onPress={left.onPress}
          name={left.icon}
          size={32}
          iconScale={0.5}
          backgroundColor={"white"}
          color="black"
        />
      );
    } else if (left.label != null) {
      return (
        <RectButton onPress={left.onPress}>
          <Text>{left.label}</Text>
        </RectButton>
      );
    }
  };

  const renderRightItem = () => {
    if (right == null || right.visible == false) return;

    console.log("HeaderHeaderHeaderHeaderHeaderHeader right.visible = " + right.visible);

    if (right.icon != null) {
      return (
        <RoundedIconButton
          onPress={right.onPress}
          name={right.icon}
          size={32}
          iconScale={0.5}
          backgroundColor={"white"}
          color="black"
        />
      );
    } else if (right.label != null) {
      return (
        <RectButton onPress={right.onPress}>
          <Text>{right.label}</Text>
        </RectButton>
      );
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: insets.top + 5,
        paddingHorizontal: 10,
      }}
    >
      {renderLeftItem()}
      <Text style={{ color: color }}>{title}</Text>
      {renderRightItem()}
    </View>
  );
};

export default Header;
