import React from "react";
import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import IconButton from "../../../components/IconButton";
import TextWithIconButton from "../../../components/TextWithIconButton";
import { DefaultDiaryImage } from "../../../constants/Images";
import { UserInformationStackNavigationProps } from "../../../routes/UserInformationNavigator";

import UiHelper from "../../../utility/UiHelper";
import DiaryMyViewFooter from "./DiaryViewFooter";

import * as _ from "lodash";
import { DiaryPage } from "../../../stores/object";

const { width, height } = Dimensions.get("window");

const imageHeight = height * 0.6;

interface DiaryViewPageProps {
  diaryPage: DiaryPage;
  navigation: UserInformationStackNavigationProps<"DiaryView">;
  onPress: () => void;
}

const DiaryViewPage = ({ diaryPage, navigation, onPress }: DiaryViewPageProps) => {
  if (diaryPage != null) {
    console.log(` DiaryMyViewPage imageUri = ${diaryPage.Record.imageUri}`);
    return (
      <View style={styles.container}>
        <View key={diaryPage.Record.documentId} style={styles.picture}>
          <Image
            source={_.isEmpty(diaryPage.Record.imageUri) == false ? { uri: diaryPage.Record.imageUri } : require("../../../../assets/diary_default_img.png")}
            defaultSource={require("../../../../assets/diary_default_img.png")}
            style={styles.image}
          />
        </View>
        <Text style={{ margin: 10, maxHeight: 100 }}>{diaryPage.Record.contents}</Text>
        <Text style={{ margin: 10, textAlign: "right" }}>{diaryPage.Record.memoryTime}</Text>
        <DiaryMyViewFooter
          onPrevPress={onPress}
          left={{
            buttons: [
              <TextWithIconButton
                value="0"
                name="message-circle"
                size={20}
                color="white"
                textColor="white"
                right={false}
                onPress={() => UiHelper.notReadyContensToastMessage()}
              />,
              <TextWithIconButton
                value="0"
                name="heart"
                color="white"
                textColor="white"
                size={20}
                right={false}
                onPress={() => UiHelper.notReadyContensToastMessage()}
              />,
            ],
          }}
          right={{
            buttons: [
              <IconButton name="edit-2" size={20} color="white" onPress={() => navigation.navigate("Diary")} />,
              <IconButton name="more-vertical" size={20} onPress={() => UiHelper.notReadyContensToastMessage()} />,
            ],
          }}
        />
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  picture: {
    width,
    height: imageHeight,
    overflow: "hidden",
  },

  profileArea: {
    height: 60,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(100,100,100,0.3)",
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
  },
  profileImageContainer: {
    opacity: 1.0,
  },
});

export default DiaryViewPage;
