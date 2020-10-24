import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as _ from "lodash";

import { DiaryRecord } from "../../../shared/records";

const { width, height } = Dimensions.get("window");
const diaryEntryWidth = width * 0.33;
const diaryEntryHeight = height * 0.25;

interface DiaryEntryProps {
  diaryRecord: DiaryRecord;
  onPress: () => void;
}

const DiaryEntry = ({ diaryRecord, onPress }: DiaryEntryProps) => {
  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          width: diaryEntryWidth,
          height: diaryEntryHeight,
          margin: 1,
          borderColor: "black",
          borderWidth: 1,
          flex: 1,
        }}
      >
        <Image
          source={_.isEmpty(diaryRecord.coverImageUri) == false ? { uri: diaryRecord.coverImageUri } : require("../../../../assets/diary_default_img.png")}
          defaultSource={require("../../../../assets/diary_default_img.png")}
          style={{ width: "100%", height: "50%" }}
        />

        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Text style={{ left: 5 }}>{diaryRecord.title}</Text>
          <Text style={{ left: 5 }}>세줄일기</Text>
          <Text style={{ left: 5 }}>{`${diaryRecord.contentCount}p`}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DiaryEntry;
