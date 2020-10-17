import React from "react";
import { View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";

export interface IconButtonProps {
  name: string;
  size: number;
  color?: string;
  onPress: () => void;
}

const IconButton = ({ name, size, color, onPress }: IconButtonProps) => {
  return (
    <View style={{ height: size, width: size }}>
      <BorderlessButton {...{ onPress }}>
        <Icon {...{ name, color, size }} />
      </BorderlessButton>
    </View>
  );
};

IconButton.defaultProps = {
  color: "white",
};

export default IconButton;
