import React from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../../../components/IconButton";
import BaseDiaryViewFooterProps from "../interface/DiaryViewFooterProps";

export interface DiaryViewFooterProps extends BaseDiaryViewFooterProps {
  left?: {
    buttons: any[];
  };
}

const DiaryViewFooter = ({ height, color, backgroundBarColor, onPrevPress, left, right }: DiaryViewFooterProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: backgroundBarColor,
        },
      ]}
    >
      <View style={styles.buttonContainer}>
        <View>
          <IconButton name="chevron-left" {...{ color }} size={20} onPress={onPrevPress} />
        </View>
        <View style={styles.buttonContainer}>
          {left &&
            left.buttons.map((value, index) => {
              return <View key={index}>{value}</View>;
            })}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {right &&
          right.buttons.map((value, index) => {
            return (
              <View key={index} style={{ margin: 5 }}>
                {value}
              </View>
            );
          })}
      </View>
    </View>
  );
};

DiaryViewFooter.defaultProps = {
  height: 40,
  color: "white",
  backgroundBarColor: "black",
  open: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default DiaryViewFooter;
