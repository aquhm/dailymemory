import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as _ from "lodash";

import { Diary } from "../../../stores/object";

const { width, height } = Dimensions.get("window");
const diaryEntryWidth = width * 0.33;
const diaryEntryHeight = height * 0.25;

interface DiaryEntryProps {
  diary: Diary;
  onPress: () => void;
}

const DiaryEntry = ({ diary, onPress }: DiaryEntryProps) => {
  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <View style={styles.container}>
        <Image
          source={_.isEmpty(diary.Record.coverImageUri) == false ? { uri: diary.Record.coverImageUri } : require("../../../../assets/diary_default_img.png")}
          defaultSource={require("../../../../assets/diary_default_img.png")}
          style={{ width: "100%", height: "50%" }}
        />

        <View style={styles.text}>
          <Text style={{ left: 5 }}>{diary.Record.title}</Text>
          <Text style={{ left: 5 }}>세줄일기</Text>
          <Text style={{ left: 5 }}>{`${diary.Record.contentCount}p`}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: diaryEntryWidth,
    height: diaryEntryHeight,
    margin: 1,
    borderColor: "black",
    borderWidth: 1,
    flex: 1,
  },
  text: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
});

export default DiaryEntry;
