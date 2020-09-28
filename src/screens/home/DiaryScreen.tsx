import React, { createRef } from "react";
import { View, Image, StyleSheet, Text, SafeAreaView, StatusBar, Dimensions } from "react-native";

import { HomeNavigationProps } from "../../routes/HomeNavigator";
import Header from "../../components/common/Header";
import LineTextInput from "../../components/Form/LineTextInput";

import DateTimePicker from "react-native-modal-datetime-picker";
import CenterMenuPopup, { BaseItem } from "../../components/CenterMenuPopup";
import PlacePopup from "../../components/diary/PlacePopup";

import { Feather as Icon } from "@expo/vector-icons";

import { RectButton } from "react-native-gesture-handler";
import ImageApi from "../../apis/Image/ImageApi";
import "moment/locale/ko";
import moment from "moment";
import * as _ from "lodash";

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
  navigation: HomeNavigationProps<"Home", "Diary">;
}

interface State {
  isDateTimePickerVisible: boolean;
  dateTime: string;
  place?: string;
  imageUri?: string;
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
      place: undefined,
    };

    this.initialize();
    moment.locale("ko");
  }

  initialize = () => {
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
    console.log("A date has been picked: ", date);

    this.setState({ dateTime: moment(date).format("LL") });

    this.hideDateTimePicker();
  };

  handlePlace = (pickedPlace: string) => {
    _.isEmpty(pickedPlace) === false && this.setState({ place: pickedPlace });
  };

  sendDiary = async () => {};

  header = () => {
    return (
      <Header
        title="일기"
        color="black"
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
            this.sendDiary();
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

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.header()}
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
              />
              {this.renderDate()}
            </View>
            {_.isEmpty(this.state.imageUri) ? this.renderSettingLayer() : this.renderPickedImage()}
          </View>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
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
