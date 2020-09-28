import React, { createRef } from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar, Dimensions } from "react-native";

import { HomeNavigationProps } from "../../routes/HomeNavigator";
import Header from "../../components/common/Header";
import LineTextInput from "../../components/Form/LineTextInput";

import DateTimePicker from "react-native-modal-datetime-picker";
import PlacePopup from "../../components/diary/PlacePopup";

import { RectButton } from "react-native-gesture-handler";
import "moment/locale/ko";
import moment from "moment";
import * as _ from "lodash";

const { width, height } = Dimensions.get("window");
const editHeight = height * 0.3;
const editWidth = width * 0.8;

interface Props {
  navigation: HomeNavigationProps<"Home", "Diary">;
}

interface State {
  isDateTimePickerVisible: boolean;
  dateTime: string;
  place?: string;
}

class DiaryScreen extends React.Component<Props, State> {
  lienTextRef = createRef<typeof LineTextInput>();
  placePopupRef = createRef<typeof PlacePopup>();
  placeTextRef = createRef<typeof Text>();

  constructor(props: Props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      dateTime: moment().format("LL"),
      place: undefined,
    };

    moment.locale("ko");
  }
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
          onPress: () => {},
          visible: true,
        }}
      />
    );
  };

  render() {
    console.log(`DiaryScreen render() editHeight = ${editHeight}`);

    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.header()}
          <View style={styles.container}>
            <View style={styles.textEditcontainer}>
              <View style={{ flex: 1 }}>
                <LineTextInput
                  ref={this.lienTextRef}
                  lineWidth={editWidth}
                  line={3}
                  lineLeading={24}
                  size={14}
                  lineColor="black"
                  placeholder="일상을 남겨주세요."
                />
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
              </View>
            </View>
            <View style={styles.imageEditcontainer}></View>
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

  textEditcontainer: {
    flex: 1,
    justifyContent: "flex-start",
  },

  imageEditcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DiaryScreen;
