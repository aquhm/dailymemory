import React from "react";
import { View, Image, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, ListRenderItemInfo, Dimensions } from "react-native";

import { FlatList } from "react-native-gesture-handler";

import { observer, inject } from "mobx-react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import Header from "../../components/common/Header";

import { RootStore, DiaryLobbyStore } from "../../stores";
import { DiaryRecord } from "../../shared/records";

import * as _ from "lodash";
import { LobbyStackNavigationProps, LobbyStackRouteProps } from "../../routes/LobbyNavigator";
import DiaryEntry from "../diary/component/DiaryEntry";

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
  data: DiaryRecord[];
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

  renderItem = (listRenderItemInfo: ListRenderItemInfo<DiaryRecord>) => {
    return (
      <DiaryEntry
        diaryRecord={listRenderItemInfo.item}
        onPress={() => {
          this.props.navigation.navigate("DiaryView", { diary: listRenderItemInfo.item });
        }}
      />
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
    const dataSource = this.props.diaryLobbyStore.values.slice();
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.renderHeader()}

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

export default LobbyScreen;
