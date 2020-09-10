import React, { createRef } from "react";
import { StatusBar, View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

import { ProfileStackNavigationProps } from "../../routes/ProfileNavigator";

import { Feather as Icon } from "@expo/vector-icons";

import ProfileRoundImage from "../../components/ProfileRoundImage";
import TextWithIconButton from "../../components/TextWithIconButton";
import BottomPopup, { BaseItem } from "../../components/BottomPopup";
import { RectButton } from "react-native-gesture-handler";

interface Props {
  navigation: ProfileStackNavigationProps<"ProfileImageChange">;
}

const menuData: BaseItem[] = [
  {
    id: 1,
    title: "사진 촬영",
    onPress: () => {},
  },

  {
    id: 2,
    title: "사진 보관함에서 선택",
    onPress: () => {},
  },

  {
    id: 3,
    title: "기본 이미지로 변경",
    onPress: () => {},
  },
];

class ProfileImageChangeScreen extends React.Component<Props> {
  bottomPopupRef = createRef();

  componentDidMount() {
    console.log("ProfileImageChangeScreen componentDidMount");
  }

  componentWillUnmount() {
    console.log("ProfileImageChangeScreen componentWillUnmount");
  }

  onClosePopup = () => {
    console.log("this.bottomPopupRef.current = " + this.bottomPopupRef.current);
    this.bottomPopupRef.current?.close();
  };

  onShowPopup = () => {
    this.bottomPopupRef.current?.open();
  };

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.head}>
            <RectButton
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Icon name="arrow-left" size={24} style={{ margin: 10 }} />
            </RectButton>
          </View>
          <View style={styles.profileArea}>
            <View style={styles.profileImageContainer}>
              <ProfileRoundImage size={80} editing onPress={() => this.onShowPopup()} />
              <TextWithIconButton
                value="김대호"
                size={12}
                name="edit-2"
                onPress={() => {
                  this.props.navigation.navigate("ProfileImageChange");
                }}
              />
            </View>
            <BottomPopup ref={(target) => (this.bottomPopupRef = target)} title="이미지 변경" data={menuData} />
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
