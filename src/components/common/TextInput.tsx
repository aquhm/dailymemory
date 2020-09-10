import React, { forwardRef } from "react";
import { TextInput, TextInputProps, View, Text, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import Style from "../../constants/Styles";
import { RoundedIcon } from "../RoundedIcon";
import * as _ from "lodash";

const ICON_SIZE = 18;

interface FormTextInputProps extends TextInputProps {
  title: string;
  icon: string;
  touched?: boolean;
  error?: string;
  value?: string;
}

const FormTextInput = forwardRef(
  ({ title, icon, touched, error, value, ...props }: FormTextInputProps, ref?: React.Ref<any>) => {
    const empty = _.isEmpty(value);

    const color: string = !touched || empty ? Style.COLOR.PLACEHOLDER : !error ? Style.COLOR.ACTIVE : Style.COLOR.ERROR;

    const validCheckIcon = touched && !empty && (
      <RoundedIcon
        name={!error ? "check" : "x"}
        size={ICON_SIZE}
        color="white"
        backgroundColor={!error ? Style.COLOR.ACTIVE : Style.COLOR.ERROR}
      />
    );

    return (
      <View>
        <Text style={styles.inputTitle}>{title}</Text>
        <View style={[styles.inputContainer, { borderColor: color }]}>
          <View style={styles.iconContainer}>
            <Icon name={icon} {...{ color }} size={16} />
          </View>
          <View style={styles.subInputContainer}>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor={Style.COLOR.PLACEHOLDER}
              {...{ ref }}
              {...props}
            />
            {validCheckIcon}
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 12,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  subInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
    paddingRight: 16,
  },

  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FormTextInput;
