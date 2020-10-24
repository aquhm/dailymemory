import React, { createRef } from "react";
import { View, Image, StyleSheet, Text, Switch, SafeAreaView, StatusBar, Dimensions, Alert } from "react-native";
import { UserInformationStackNavigationProps } from "../../routes/UserInformationNavigator";

import { observer, inject } from "mobx-react";

import Header from "../../components/common/Header";
import LineTextInput from "../../components/Form/LineTextInput";

import CenterMenuPopup, { BaseItem } from "../../components/CenterMenuPopup";
import PlacePopup from "../../components/diary/PlacePopup";

import { Feather as Icon } from "@expo/vector-icons";

import { RectButton } from "react-native-gesture-handler";
import ImageApi from "../../apis/Image/ImageApi";
import * as _ from "lodash";

import { RootStore } from "../../stores";

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
  navigation: UserInformationStackNavigationProps<"DiaryCreate">;
}

interface State {
  title: string;
  imageUri: string;
  open: boolean;
}

@inject("authStore")
@observer
class DiaryCreateScreen extends React.Component<Props, State> {
  lienTextRef = createRef<typeof LineTextInput>();
  placePopupRef = createRef<typeof PlacePopup>();
  placeTextRef = createRef<typeof Text>();
  centerMenuPopupRef = createRef<typeof CenterMenuPopup>();

  constructor(props: Props) {
    super(props);
    this.state = {
      title: "",
      imageUri: "",
      open: true,
    };

    this.initialize();
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
    console.log(`${DiaryCreateScreen} componentDidMount`);
  }

  componentWillUnmount() {
    console.log(`${DiaryCreateScreen} componentWillUnmount`);
  }

  sendCreateDiary = async () => {
    const { title, open, imageUri } = this.state;

    RootStore.Instance.DiaryStore.Create(title, open, imageUri, () => {
      Alert.alert("Success");
      this.props.navigation.goBack();
    });
  };

  header = () => {
    return (
      <Header
        title="새 일기책 만들기"
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
            this.sendCreateDiary();
          },
          visible: true,
        }}
      />
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
                line={2}
                lineLeading={24}
                size={14}
                lineColor="black"
                placeholder="제목을 남겨주세요."
                onChangeText={(title) => this.setState({ title })}
                textAlignVertical="top"
                value={this.state.title}
              />

              <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
                <Text>공개</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(toggle) => this.setState({ open: !this.state.open })}
                  value={this.state.open}
                />
              </View>
            </View>
            {_.isEmpty(this.state.imageUri) ? this.renderSettingLayer() : this.renderPickedImage()}
          </View>
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

export default DiaryCreateScreen;
