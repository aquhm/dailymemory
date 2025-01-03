import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";

interface TextWithIconButtonProps {
  value: string;
  name: string;
  size?: number;
  textColor?: string;
  color?: string;
  right?: boolean;
  onPress?: () => void;
}

const TextWithIconButton = ({ value, size, name, textColor, color, right, onPress }: TextWithIconButtonProps) => {
  const content = right ? (
    <Text style={[styles.text, { color: textColor }]}>
      <Text>{value}</Text> <Icon {...{ name, color, size }} />
    </Text>
  ) : (
    <Text style={[styles.text, { color: textColor }]}>
      <Icon {...{ name, color, size }} /> <Text>{value}</Text>
    </Text>
  );

  return (
    <BorderlessButton {...{ onPress }}>
      <View style={styles.container}>{content}</View>
    </BorderlessButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    marginHorizontal: 10,
  },
});

TextWithIconButton.defaultProps = {
  size: 12,
  textColor: "black",
  color: "#black",
  right: true,
};

export default TextWithIconButton;
