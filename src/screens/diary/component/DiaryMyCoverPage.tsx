import React from "react";
import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import IconButton from "../../../components/IconButton";
import ProfileRoundImage from "../../../components/ProfileRoundImage";
import { DefaultProfileImage } from "../../../constants/Images";
import { UserInformationStackNavigationProps } from "../../../routes/UserInformationNavigator";
import { DiaryRecord } from "../../../shared/records";
import { RootStore } from "../../../stores";
import UiHelper from "../../../utility/UiHelper";

import DiaryMyCoverFooter from "./DiaryMyCoverFooter";

const { width, height } = Dimensions.get("window");

const imageHeight = height * 0.6;

interface DiaryMyCoverPageProps {
  diary: DiaryRecord;
  navigation: UserInformationStackNavigationProps<"DiaryView">;
}

const DiaryMyCoverPage = ({ diary, navigation }: DiaryMyCoverPageProps) => {
  if (diary != null) {
    return (
      <View key={diary.documentId} style={styles.container}>
        <View style={styles.picture}>
          <Image source={{ uri: diary.coverImageUri }} style={styles.image} />
          <View style={{ ...StyleSheet.absoluteFillObject, flexDirection: "column-reverse" }}>
            <View style={styles.profileArea}>
              <ProfileRoundImage
                imageUri={RootStore.Instance.AuthStore.profileImageUri ?? DefaultProfileImage}
                size={50}
              />
              <Text style={{ margin: 10 }}>{RootStore.Instance.AuthStore.user.name}</Text>
            </View>
          </View>
        </View>
        <Text style={{ margin: 10, maxHeight: 100 }}>{diary.title}</Text>
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

export default DiaryMyCoverPage;
