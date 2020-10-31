import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, ListRenderItemInfo, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { observer, inject, Observer } from "mobx-react";

import * as _ from "lodash";

import { LobbyStackNavigationProps, LobbyStackRouteProps } from "../../routes/LobbyNavigator";

import { RootStore, DiaryLobbyStore } from "../../stores";

import DiaryEntry from "../diary/component/DiaryEntry";
import { Diary } from "../../stores/object";
import { toJS } from "mobx";

const { width, height } = Dimensions.get("window");
const diaryEntryWidth = width * 0.33;
const diaryEntryHeight = height * 0.25;
const headerHeight = height * 0.25;

interface Props {
  navigation: LobbyStackNavigationProps<"Lobby">;
  route: LobbyStackRouteProps<"Lobby">;
  diaryLobbyStore: DiaryLobbyStore;
}

interface State {
  data: Diary[];
}

@inject("diaryLobbyStore")
@observer
class LobbyScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.props.navigation.addListener("focus", () => {
      console.log("LobbyScreen focus");
      this.updateDiaryList();
    });

    this.props.navigation.addListener("blur", () => {
      console.log("LobbyScreen blur");
    });
  }

  updateDiaryList = async () => {
    await RootStore.Instance.DiaryLobbyStore.getListAsync();
  };

  componentDidMount() {
    console.log("UserInformationScreen componentDidMount");
  }

  componentWillUnmount() {
    console.log("UserInformationScreen componentWillUnmount");
  }

  renderItem = (listRenderItemInfo: ListRenderItemInfo<Diary>) => {
    return (
      <Observer>
        {() => (
          <DiaryEntry
            diary={listRenderItemInfo.item}
            onPress={() => {
              this.props.navigation.navigate("DiaryView", { diary: listRenderItemInfo.item });
            }}
          />
        )}
      </Observer>
    );
  };

  renderSetperator = () => {
    return <View style={{ backgroundColor: "gray", height: StyleSheet.hairlineWidth }}></View>;
  };

  renderHeader = () => {
    return (
      <View style={{ justifyContent: "center", height: headerHeight }}>
        <Text style={{ fontSize: 16, alignSelf: "center" }}>세줄 일기</Text>
      </View>
    );
  };

  render() {
    console.log("-------------------------------UserInformationScreen render");
    const dataSource = toJS(this.props.diaryLobbyStore.Values);

    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.renderHeader()}

          <ScrollView style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={dataSource}
              extraData={dataSource}
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

export default LobbyScreen;
