import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar } from "react-native";

import { ProfileStackNavigationProps } from "../../routes/ProfileNavigator";

import { observer, inject } from "mobx-react";
import { DefaultProfileImage } from "../../constants/Images";
import ProfileRoundImage from "../../components/ProfileRoundImage";
import TextWithIconButton from "../../components/TextWithIconButton";

import Header from "../../components/common/Header";

import { RootStore, AuthStore } from "../../stores";

interface Props {
  navigation: ProfileStackNavigationProps<"Profile">;
  authStore: AuthStore;
}

@inject("authStore")
@observer
class ProfileScreen extends React.Component<Props> {
  componentDidMount() {
    console.log("ProfileScreen componentDidMount");
  }

  componentWillUnmount() {
    console.log("ProfileScreen componentWillUnmount");
  }

  header = () => {
    return (
      <Header
        title="내 정보"
        color="black"
        left={{
          icon: "arrow-left",
          onPress: () => {
            this.props.navigation.goBack();
          },
          visible: true,
        }}
      />
    );
  };

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.header()}
          <ScrollView>
            <View style={styles.profileArea}>
              <View style={styles.profileImageContainer}>
                <ProfileRoundImage
                  imageUri={RootStore.Instance.AuthStore.profileImageUri ?? DefaultProfileImage}
                  //imageUri={DefaultProfileImage}
                  size={80}
                  showEditIcon
                  onPress={() => {
                    this.props.navigation.navigate("ProfileImageChange");
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
            </View>
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

export default ProfileScreen;
