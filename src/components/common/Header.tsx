import React from "react";
import { View, Text } from "react-native";
import { RectButton, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoundedIconButton from "../RoundedIconButton";
import { Feather as Icon } from "@expo/vector-icons";

export interface HeaderProps {
  left?: {
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
  onPress?: () => void;
  icon?: string;
  iconSize?: number;
}

const Header = ({ left, right, title, color, icon, iconSize, onPress }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  const renderLeftItem = () => {
    if (left == null || left.visible == false) return <View />;

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

  const renderCenterItem = () => {
    return (
      <View>
        <TouchableWithoutFeedback style={{ flexDirection: "row" }} {...{ onPress }}>
          <Text style={{ color: color }}>{title}</Text>
          {icon && <Icon name={icon} size={iconSize} />}
        </TouchableWithoutFeedback>
      </View>
    );
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
      {renderCenterItem()}
      {renderRightItem()}
    </View>
  );
};

export default Header;
