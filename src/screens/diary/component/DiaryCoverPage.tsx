import React from "react";
import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import IconButton from "../../../components/IconButton";
import ProfileRoundImage from "../../../components/ProfileRoundImage";
import { DefaultDiaryImage, DefaultProfileImage } from "../../../constants/Images";
import { UserInformationStackNavigationProps } from "../../../routes/UserInformationNavigator";
import UiHelper from "../../../utility/UiHelper";

import DiaryMyCoverFooter from "./DiaryCoverFooter";
import * as _ from "lodash";
import { Diary } from "../../../stores/object";

const { width, height } = Dimensions.get("window");

const imageHeight = height * 0.6;

interface DiaryCoverPageProps {
  diary: Diary;
  navigation: UserInformationStackNavigationProps<"DiaryView">;
}

const DiaryCoverPage = ({ diary, navigation }: DiaryCoverPageProps) => {
  if (diary != null) {
    console.log(`DiaryCoverPage diary.User = ${diary.User}`);
    return (
      <View style={styles.container}>
        <View style={styles.picture}>
          <Image
            source={_.isEmpty(diary.Record.coverImageUri) == false ? { uri: diary.Record.coverImageUri } : DefaultDiaryImage}
            defaultSource={DefaultDiaryImage}
            style={styles.image}
          />
          <View style={{ ...StyleSheet.absoluteFillObject, flexDirection: "column-reverse" }}>
            <View style={styles.profileArea}>
              <ProfileRoundImage
                imageUri={diary.User?.Record.profile_uri ?? DefaultProfileImage}
                size={50}
                onPress={() => {
                  navigation.navigate("UserInformation", { user: diary.User });
                }}
              />
              <Text style={{ margin: 10 }}>{diary.User?.Record.name}</Text>
            </View>
          </View>
        </View>
        <Text style={{ margin: 10, maxHeight: 100 }}>{diary.Record.title}</Text>
        <DiaryMyCoverFooter
          onPrevPress={() => navigation.goBack()}
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

export default DiaryCoverPage;
