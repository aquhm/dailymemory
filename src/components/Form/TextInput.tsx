import React, { forwardRef, RefObject } from "react"
import { TextInput as RNTextInput, View, Text, StyleSheet } from "react-native"
import { Feather as Icon } from "@expo/vector-icons"
import Style from "../../constants/Styles"
import * as _ from "lodash"

const ICON_SIZE = 18

interface TextInputProps {
  title: string
  icon: string
  touched?: boolean
  error?: string
  value?: string
}

const TextInput = forwardRef(
  ({ title, icon, touched, error, value, ...props }: TextInputProps, ref) => {
    const empty = _.isEmpty(value)

    const color: string =
      !touched || empty
        ? Style.COLOR.PLACEHOLDER
        : !error
        ? Style.COLOR.ACTIVE
        : Style.COLOR.ERROR

    const validCheckIcon = touched && !empty && (
      <View
        style={[
          styles.icon,
          { backgroundColor: !error ? Style.COLOR.ACTIVE : Style.COLOR.ERROR },
        ]}
      >
        <Icon name={!error ? "check" : "x"} color="white" size={16} />
      </View>
    )
    return (
      <View>
        <Text style={styles.inputTitle}>{title}</Text>
        <View style={[styles.inputContainer, { borderColor: color }]}>
          <View style={styles.iconContainer}>
            <Icon name={icon} {...{ color }} size={16} />
          </View>
          <View style={styles.subInputContainer}>
            <RNTextInput
              underlineColorAndroid="transparent"
              placeholderTextColor={Style.COLOR.PLACEHOLDER}
              {...{ ref }}
              {...props}
            />
            {validCheckIcon}
          </View>
        </View>
      </View>
    )
  }
)

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
})

export default TextInput
