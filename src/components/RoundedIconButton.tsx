import React from "react";
import { View } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import { RoundedIcon, RoundedIconProps } from "./RoundedIcon";

interface RoundedIconButtonProps extends RoundedIconProps {
  onPress: () => void;
}

const RoundedIconButton = ({ onPress, ...props }: RoundedIconButtonProps) => {
  return (
    <View>
      <RectButton {...{ onPress }}>
        <RoundedIcon {...props} />
      </RectButton>
    </View>
  );
};

export default RoundedIconButton;
