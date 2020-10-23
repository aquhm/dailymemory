import React from "react";
import { View, Text } from "react-native";
import IconButton from "../../../components/IconButton";

import DiaryViewFooter from "../interface/DiaryViewFooter";

export interface DiaryMyCoverFooterProps extends DiaryViewFooter {}

const DiaryMyCoverFooter = ({ open, height, color, backgroundBarColor, onPrevPress, right }: DiaryMyCoverFooterProps) => {
  const subscribe = (
    <View>
      <Text style={{ color: "white" }}> {open ? "0명 구독중" : "비공개"}</Text>
    </View>
  );

  return (
    <View
      style={{
        flexDirection: "row",
        height,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: backgroundBarColor,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View>
          <IconButton name="chevron-left" {...{ color }} size={20} onPress={onPrevPress} />
        </View>
        {subscribe}
      </View>
      <View style={{ flexDirection: "row" }}>
        {right &&
          right.buttons.map((value, index) => {
            return (
              <View key={index.toString()} style={{ margin: 5 }}>
                {value}
              </View>
            );
          })}
      </View>
    </View>
  );
};

DiaryMyCoverFooter.defaultProps = {
  height: 40,
  color: "white",
  backgroundBarColor: "black",
  open: false,
};

export default DiaryMyCoverFooter;
