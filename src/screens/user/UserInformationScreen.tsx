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
import { Diary } from "../../stores/object";

const { width, height } = Dimensions.get("window");
const diaryEntryWidth = width * 0.33;
const diaryEntryHeight = height * 0.25;

interface Props {
  navigation: UserInformationStackNavigationProps<"UserInformation">;
  route: UserInformationStackRouteProps<"UserInformation">;
  authStore: AuthStore;
  diaryStore: DiaryStore;
}

interface State {
  data: Diary[];
  updating: boolean;
}

@inject("authStore")
@inject("diaryStore")
@observer
class UserInformationScreen extends React.Component<Props, State> {
  private defaultData: Diary;
  constructor(props: Props) {
    super(props);

    this.defaultData = new Diary({ userId: "", documentId: "", title: "새 일기책 만들기", coverImageUri: "", contentCount: 0 }, "diaries");
    this.state = { data: [this.defaultData], updating: false };

    this.props.navigation.addListener("focus", () => {
      console.log("UserInformationScreen focus");

      this.updateList();
      //My.LatestDiariesAsync();
    });

    this.props.navigation.addListener("blur", () => {
      console.log("UserInformationScreen blur");
    });
  }

  updateList = async () => {
    const { user } = this.props.route.params;

    user && (await RootStore.Instance.DiaryStore.getListAsync(user.Record.documentId));

    this.setState({ data: [this.defaultData, ...this.props.diaryStore.Values.slice()] });
  };

  /*
  shouldComponentUpdate(nextProps: IAppProps, nextState: IAppState) {
    return this.state.data !== nextState.data;
  }
  */

  componentDidMount() {
    console.log("UserInformationScreen componentDidMount");
  }

  componentWillUnmount() {
    console.log("UserInformationScreen componentWillUnmount");
  }

  renderCreateButton = (listRenderItemInfo: ListRenderItemInfo<Diary>) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.navigate("DiaryCreate");
        }}
      >
        <View style={styles.createButton}>
          <Icon name="book" size={24} />
          <Text>{listRenderItemInfo.item.Record.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderDiaryEntry = (listRenderItemInfo: ListRenderItemInfo<Diary>) => {
    return (
      <DiaryEntry
        diary={listRenderItemInfo.item}
        onPress={() => {
          this.props.navigation.navigate("DiaryView", { diary: listRenderItemInfo.item });
        }}
      />
    );
  };

  renderItem = (listRenderItemInfo: ListRenderItemInfo<Diary>) => {
    if (_.isEmpty(listRenderItemInfo.item.Record.userId)) {
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
    const { user } = this.props.route.params;

    return (
      <View style={{ flex: 1, padding: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <ProfileRoundImage imageUri={user?.Record.profile_uri ?? DefaultProfileImage} size={80} onPress={() => {}} />
          <View style={{ flex: 1, marginLeft: 20, marginTop: 5 }}>
            <Text style={{ fontSize: 12 }}>{`안녕하세요? 일기를 쓰고 있는 세줄작가 ${user?.Record.name} 입니다. 제 삶의 이야기 책들을 만나보세요.`}</Text>

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
    console.log("UserInformationScreen render");
    //const dataSource = [defaultData, ...this.props.diaryStore.values.slice()];
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.header()}
          <Text style={{ fontSize: 10, alignSelf: "center" }}>하루를 돌아보며 나의 삶을 기업합니다.</Text>
          {this.profile()}

          <ScrollView style={{ flex: 1 }}>
            <FlatList
              refreshing={this.state.updating}
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              renderItem={this.renderItem}
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

  createButton: {
    justifyContent: "center",
    alignItems: "center",
    width: diaryEntryWidth,
    height: diaryEntryHeight,
    margin: 1,
    borderColor: "black",
    borderWidth: 1,
  },
});

export default UserInformationScreen;
