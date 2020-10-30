import React, { createRef } from "react";
import { View, Image, StyleSheet, Text, SafeAreaView, StatusBar, Dimensions, Alert, ListRenderItemInfo, TouchableOpacity } from "react-native";

import { DiaryNavigatorStackProps } from "../../routes/HomeNavigator";
import Header from "../../components/common/Header";
import LineTextInput from "../../components/Form/LineTextInput";

import DateTimePicker from "react-native-modal-datetime-picker";
import CenterMenuPopup, { BaseItem } from "../../components/CenterMenuPopup";
import PlacePopup from "../../components/diary/PlacePopup";

import { Feather as Icon } from "@expo/vector-icons";

import { FlatList, RectButton } from "react-native-gesture-handler";
import ImageApi from "../../apis/Image/ImageApi";

import moment from "moment";
import "moment/locale/ko";

import * as _ from "lodash";

import { RootStore } from "../../stores";

import { SwipeablePanel } from "rn-swipeable-panel";
import { DiaryRecord } from "../../shared/records";
import { Diary } from "../../stores/object";

const { width, height } = Dimensions.get("window");
const editHeight = height * 0.3;
const editWidth = width * 0.8;

const menuData: BaseItem[] = [
  {
    id: 1,
    title: "사진 보관함에서 선택",
  },

  {
    id: 2,
    title: "사진 촬영",
  },
];

interface Props {
  navigation: DiaryNavigatorStackProps<"Diary">;
}

interface State {
  isDateTimePickerVisible: boolean;
  dateTime: string;
  place: string;
  imageUri: string;
  contents: string;
  diaryPicker: boolean;
  currentDiary?: Diary;
}

class DiaryScreen extends React.Component<Props, State> {
  lienTextRef = createRef<typeof LineTextInput>();
  placePopupRef = createRef<typeof PlacePopup>();
  placeTextRef = createRef<typeof Text>();
  centerMenuPopupRef = createRef<typeof CenterMenuPopup>();

  constructor(props: Props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      dateTime: moment().format("LL"),
      place: "",
      contents: "",
      imageUri: "",
      diaryPicker: false,
    };

    this.initialize();
    moment.locale("ko");
  }

  initialize = () => {
    this.InitializeImageMenu();

    this.props.navigation.addListener("focus", () => {
      this.setState({ currentDiary: undefined });
    });

    this.props.navigation.addListener("blur", () => {});
  };

  private InitializeImageMenu = () => {
    menuData[0].onPress = () => {
      // @ts-ignore
      this.centerMenuPopupRef.current?.close();

      ImageApi.changeProfileImageAsync().then((result) => {
        if (result != null) {
          if (!result.cancelled) {
            this.setState({ imageUri: result.uri });
          }
        }
      });
    };

    menuData[1].onPress = () => {
      // @ts-ignore
      this.centerMenuPopupRef.current?.close();

      ImageApi.changeProfileImageByCameraAsync().then((result) => {
        if (result != null) {
          if (!result.cancelled) {
            this.setState({ imageUri: result.uri });
          }
        }
      });
    };
  };

  componentDidMount() {
    console.log(" componentDidMount DiaryScreen");

    if (RootStore.Instance.DiaryStore.Values.length > 1) {
      this.setState({ diaryPicker: true });
    } else {
      const [first] = RootStore.Instance.DiaryStore.Values;
      this.setState({ currentDiary: first });
    }
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount DiaryScreen");
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (date: Date) => {
    this.setState({ dateTime: moment(date).format("LL") });

    this.hideDateTimePicker();
  };

  handlePlace = (pickedPlace: string) => {
    _.isEmpty(pickedPlace) === false && this.setState({ place: pickedPlace });
  };

  createDiaryPage = async (completed: () => void) => {
    if (this.state.currentDiary != null) {
      const { currentDiary, contents, imageUri, place, dateTime } = this.state;
      RootStore.Instance.DiaryPageStore.Create(currentDiary, contents, imageUri, place, dateTime, completed);
    }
  };

  renderHeader = () => {
    const diaryQuantity = RootStore.Instance.DiaryStore.Values.length;
    const title = this.state.currentDiary != null ? this.state.currentDiary.Record.title : "일기책을 선택해 주세요.";
    return (
      <Header
        {...{ title }}
        icon="chevron-down"
        iconSize={18}
        color="black"
        onPress={() => {
          if (diaryQuantity > 1) {
            this.setState({ diaryPicker: true });
          }
        }}
        left={{
          icon: "arrow-left",
          onPress: () => {
            this.props.navigation.goBack();
          },
          visible: true,
        }}
        right={{
          icon: "check",
          onPress: () => {
            if (diaryQuantity > 1 && this.state.currentDiary == null) {
              this.setState({ diaryPicker: true });
            } else {
              if (_.isEmpty(this.state.contents)) {
                Alert.alert("required contens");
              } else {
                this.createDiaryPage(() => {
                  this.props.navigation.navigate("DiaryView", { diary: this.state.currentDiary! });
                  Alert.alert("Success");
                });
              }
            }
          },
          visible: true,
        }}
      />
    );
  };

  renderDate = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row-reverse", marginTop: 30, justifyContent: "space-between" }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <RectButton
            onPress={() => {
              this.showDateTimePicker();
            }}
          >
            <Text>{this.state.dateTime}</Text>
          </RectButton>
          <Text>/</Text>

          <RectButton
            onPress={() => {
              // @ts-ignore
              this.placePopupRef.current?.open();
            }}
          >
            <Text style={{ opacity: this.state.place ? 1.0 : 0.5 }}>{this.state.place || "장소에서"}</Text>
          </RectButton>
          <RectButton
            onPress={() => {
              this.props.navigation.navigate("Map");
            }}
          >
            <Icon name="map-pin" size={24} />
          </RectButton>
        </View>
      </View>
    );
  };

  renderSettingLayer = () => {
    return (
      <View style={styles.imageEditcontainer}>
        <RectButton
          onPress={() => {
            // @ts-ignore
            this.centerMenuPopupRef.current?.open();
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Icon style={{ justifyContent: "center", alignItems: "center" }} name="image" color="white" size={96} />
            <Text style={{ color: "white" }}>사진을 넣어주세요.</Text>
          </View>
        </RectButton>
      </View>
    );
  };

  renderPickedImage = () => {
    return (
      <View style={styles.imageEditcontainer}>
        <Image source={{ uri: this.state.imageUri }} style={{ width: "100%", height: "100%" }} />
        <View style={{ position: "absolute", top: 10, right: 10 }}>
          <RectButton
            onPress={() => {
              this.setState({ imageUri: "" });
            }}
          >
            <Icon style={{ justifyContent: "center", alignItems: "center" }} name="x-circle" color="black" size={30} />
          </RectButton>
        </View>
      </View>
    );
  };

  renderSwiperableItemComponent = (listRenderItemInfo: ListRenderItemInfo<Diary>) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        <View style={{ justifyContent: "flex-start" }}>
          <Text>{listRenderItemInfo.item.Record.title}</Text>
          <Text>
            {listRenderItemInfo.item.Record.private ? "비공개" : "공개"} | {listRenderItemInfo.item.Record.contentCount}p
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ diaryPicker: false, currentDiary: listRenderItemInfo.item });
            }}
          >
            <Icon name="circle" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderDiaryPicker = () => {
    return (
      <SwipeablePanel
        isActive={this.state.diaryPicker}
        onClose={() => {
          this.setState({ diaryPicker: false });
        }}
        closeOnTouchOutside={true}
      >
        <Text style={{ margin: 10 }}>내 일기책 선택</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={RootStore.Instance.DiaryStore.Values}
          extraData={RootStore.Instance.DiaryStore.Values}
          renderItem={this.renderSwiperableItemComponent}
          keyExtractor={(item, _) => item.Record.documentId}
          contentContainerStyle={{ paddingBottom: 40 }}
        ></FlatList>
      </SwipeablePanel>
    );
  };

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.renderHeader()}
          <View style={styles.container}>
            <View style={{ flex: 0.4 }}>
              <LineTextInput
                ref={this.lienTextRef}
                lineWidth={editWidth}
                line={3}
                lineLeading={24}
                size={14}
                lineColor="black"
                placeholder="일상을 남겨주세요."
                onChangeText={(text) => this.setState({ contents: text })}
                value={this.state.contents}
              />
              {this.renderDate()}
            </View>
            {_.isEmpty(this.state.imageUri) ? this.renderSettingLayer() : this.renderPickedImage()}
          </View>

          <DateTimePicker isVisible={this.state.isDateTimePickerVisible} onConfirm={this.handleDatePicked} onCancel={this.hideDateTimePicker} />
          <PlacePopup
            ref={this.placePopupRef}
            title="장소"
            ok={this.handlePlace}
            cancel={() => {
              // @ts-ignore
              this.placePopupRef.current?.close();
            }}
          />
          <CenterMenuPopup ref={this.centerMenuPopupRef} data={menuData} />
          {this.renderDiaryPicker()}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  imageEditcontainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
  },
});

export default DiaryScreen;
