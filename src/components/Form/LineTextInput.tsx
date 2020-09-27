import React, { forwardRef, useState } from "react";
import { TextInput, TextInputProps, View, StyleSheet } from "react-native";

import Style from "../../constants/Styles";
import * as _ from "lodash";

interface LineTextInputProps extends TextInputProps {
  lineWidth: number;
  line?: number;
  lineOpacity?: number;
  lineColor?: string;
  lineLeading?: number;
  size?: number;
  touched?: boolean;
  error?: string;
  value?: string;
}

const LineTextInput = forwardRef(
  (
    { line, lineColor, lineWidth, lineOpacity, lineLeading, size, touched, error, value, ...props }: LineTextInputProps,
    ref?: React.Ref<any>
  ) => {
    const [messageText, setMessageText] = useState<string>("");

    const textLine = (key: number) => (
      <View
        key={key}
        style={{ height: lineLeading, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: lineColor }}
      />
    );

    const LineBg = () => (
      <View style={{ ...StyleSheet.absoluteFillObject, opacity: lineOpacity, marginTop: 20 }}>
        {[...Array(line)].map((n, index) => {
          return textLine(index);
        })}
      </View>
    );

    return (
      <View style={{ width: lineWidth }}>
        {LineBg()}
        <View style={{ marginTop: 20 }}>
          <TextInput
            style={{
              lineHeight: lineLeading,
              fontSize: size,
              textDecorationLine: "underline",
            }}
            underlineColorAndroid="transparent"
            placeholderTextColor={Style.COLOR.PLACEHOLDER}
            multiline
            numberOfLines={3}
            onChangeText={(editedText) => setMessageText(editedText)}
            textAlignVertical="top"
            value={messageText}
            {...{ ref }}
            {...props}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  editBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

LineTextInput.defaultProps = {
  lineColor: "#000000",
  line: 3,
  size: 14,
  lineLeading: 30,
};

export default LineTextInput;
