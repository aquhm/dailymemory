import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, ListRenderItemInfo, Dimensions } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { FontAwesome as Icon } from "@expo/vector-icons";

import { UserInformationStackNavigationProps, UserInformationStackRouteProps } from "../../routes/UserInformationNavigator";

import { observer, inject } from "mobx-react";
import { DefaultProfileImage } from "../../constants/Images";
import ProfileRoundImage from "../../components/ProfileRoundImage";
import { RectButton, TouchableWithoutFeedback } from "react-native-gesture-handler";

import Header from "../../components/common/Header";

import { RootStore, DiaryStore, AuthStore } from "../../stores";
import { DiaryRecord } from "../../shared/records";

import * as _ from "lodash";
import DiaryEntry from "../diary/component/DiaryEntry";

const { width, height } = Dimensions.get("window");
const diaryEntryWidth = width * 0.33;
const diaryEntryHeight = height * 0.25;

const defaultData: DiaryRecord = {
  userId: "",
  documentId: "",
  title: "새 일기책 만들기",
  coverImageUri: "",
  contentCount: 0,
};

interface Props {
  navigation: UserInformationStackNavigationProps<"UserInformation">;
  route: UserInformationStackRouteProps<"UserInformation">;
  authStore: AuthStore;
  diaryStore: DiaryStore;
}

interface State {
  data: DiaryRecord[];
}

@inject("authStore")
@inject("diaryStore")
@observer
class UserInformationScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { data: [defaultData] };

    this.props.navigation.addListener("focus", () => {
      console.log("UserInformationScreen focus");

      this.updateDiaryList();
    });

    this.props.navigation.addListener("blur", () => {
      console.log("UserInformationScreen blur");
    });
  }

  updateDiaryList = async () => {
    await RootStore.Instance.DiaryStore.getListAsync();
  };

  componentDidMount() {
    console.log("UserInformationScreen componentDidMount");
  }

  componentWillUnmount() {
    console.log("UserInformationScreen componentWillUnmount");
  }

  renderCreateButton = (listRenderItemInfo: ListRenderItemInfo<DiaryRecord>) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.navigate("DiaryCreate");
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: diaryEntryWidth,
            height: diaryEntryHeight,
            margin: 1,
            borderColor: "black",
            borderWidth: 1,
          }}
        >
          <Icon name="book" size={24} />
          <Text>{listRenderItemInfo.item.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderDiaryEntry = (listRenderItemInfo: ListRenderItemInfo<DiaryRecord>) => {
    return (
      <DiaryEntry
        diaryRecord={listRenderItemInfo.item}
        onPress={() => {
          this.props.navigation.navigate("DiaryView", { diary: listRenderItemInfo.item });
        }}
      />
    );
  };

  renderItem = (listRenderItemInfo: ListRenderItemInfo<DiaryRecord>) => {
    if (_.isEmpty(listRenderItemInfo.item.userId)) {
      return this.renderCreateButton(listRenderItemInfo);
    } else {
      return this.renderDiaryEntry(listRenderItemInfo);
    }
  };

  header = () => {
    return (
      <Header
        title="나의 일기"
        color="black"
        right={{
          icon: "settings",
          onPress: () => {},
          visible: true,
        }}
      />
    );
  };

  profile = () => {
    return (
      <View style={{ flex: 1, padding: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <ProfileRoundImage imageUri={RootStore.Instance.AuthStore.profileImageUri ?? DefaultProfileImage} size={80} onPress={() => {}} />
          <View style={{ flex: 1, marginLeft: 20, marginTop: 5 }}>
            <Text style={{ fontSize: 12 }}>
              {`안녕하세요? 일기를 쓰고 있는 세줄작가 ${RootStore.Instance.AuthStore.user.name} 입니다. 제 삶의 이야기 책들을 만나보세요.`}
            </Text>

            <View style={{ flexDirection: "row" }}>
              <RectButton>
                <View
                  style={{
                    backgroundColor: "#9CDECB",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>프로필 수정</Text>
                </View>
              </RectButton>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderSetperator = () => {
    return <View style={{ backgroundColor: "gray", height: StyleSheet.hairlineWidth }}></View>;
  };

  render() {
    const dataSource = [defaultData, ...this.props.diaryStore.values.slice()];
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.header()}
          <Text style={{ fontSize: 10, alignSelf: "center" }}>하루를 돌아보며 나의 삶을 기업합니다.</Text>
          {this.profile()}

          <ScrollView style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={dataSource}
              renderItem={this.renderItem}
              extraData={dataSource}
              keyExtractor={(item, _) => item.toString()}
              ItemSeparatorComponent={this.renderSetperator}
              contentContainerStyle={{ paddingBottom: 40 }}
              numColumns={3}
            />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    margin: 10,
  },

  profileArea: {
    height: 200,
    alignItems: "center",
    alignContent: "stretch",
    borderBottomColor: "gray",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default UserInformationScreen;
