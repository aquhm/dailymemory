import React, { createRef } from "react";
import { StatusBar, View, StyleSheet, Platform, SafeAreaView, Alert } from "react-native";

import { ProfileStackNavigationProps } from "../../routes/ProfileNavigator";

import { Feather as Icon } from "@expo/vector-icons";

import ProfileRoundImage from "../../components/ProfileRoundImage";
import TextWithIconButton from "../../components/TextWithIconButton";
import BottomPopup, { BaseItem } from "../../components/BottomPopup";
import { RectButton } from "react-native-gesture-handler";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as _ from "lodash";

import Header from "../../components/common/Header";
import Firebase from "../../Firebase";
import * as firebase from "firebase";
import RootStore from "../../stores/RootStore";

interface Props {
  navigation: ProfileStackNavigationProps<"ProfileImageChange">;
}

interface State {
  imageUri?: string;
}

const menuData: BaseItem[] = [
  {
    id: 1,
    title: "사진 촬영",
  },

  {
    id: 2,
    title: "사진 보관함에서 선택",
  },

  {
    id: 3,
    title: "기본 이미지로 변경",
  },
];

class ProfileImageChangeScreen extends React.Component<Props, State> {
  state: State = {
    imageUri: undefined,
  };

  bottomPopupRef = createRef<typeof BottomPopup>();

  componentDidMount() {
    console.log("ProfileImageChangeScreen componentDidMount");

    this.initialize();
  }

  initialize = () => {
    menuData[0].onPress = () => {
      // @ts-ignore
      this.bottomPopupRef.current?.close();
      this.changeProfileImageByCameraAsync();
    };

    menuData[1].onPress = () => {
      // @ts-ignore
      this.bottomPopupRef.current?.close();
      this.changeProfileImageAsync();
    };
  };

  changeProfileImageAsync = async () => {
    await this.getPermissionAsync();
    await this.pickImageAsync();
  };

  changeProfileImageByCameraAsync = async () => {
    await this.getPermissionAsync();
    await this.cameraImageAsync();
  };

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    }
  };

  pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ imageUri: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  cameraImageAsync = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ imageUri: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  uploadImage = () => {
    if (this.state.imageUri != null && _.isEmpty(this.state.imageUri) == false) {
      RootStore.Instance.AuthStore.UploadImage(this.state.imageUri, () => {
        Alert.alert("Success");
      });
    }
  };

  header = () => {
    return (
      <Header
        title="수정"
        color="black"
        left={{
          icon: "arrow-left",
          onPress: () => {
            this.props.navigation.goBack();
          },
          visible: true,
        }}
        right={{
          label: "저장하기",
          onPress: () => {
            this.uploadImage();
          },
          visible: _.isEmpty(this.state.imageUri) == false,
        }}
      />
    );
  };

  componentWillUnmount() {}

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.header()}
          <View style={styles.profileArea}>
            <View style={styles.profileImageContainer}>
              <ProfileRoundImage
                imageUri={this.state.imageUri}
                size={80}
                editing
                onPress={() => {
                  // @ts-ignore
                  this.bottomPopupRef.current?.open();
                }}
              />
              <TextWithIconButton
                value="김대호"
                size={12}
                name="edit-2"
                onPress={() => {
                  this.props.navigation.navigate("ProfileImageChange");
                }}
              />
            </View>
            <BottomPopup ref={this.bottomPopupRef} title="이미지 변경" data={menuData} />
          </View>
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
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "gray",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  profileImageContainer: {
    height: 120,
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default ProfileImageChangeScreen;
