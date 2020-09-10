import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from "react-native";

import { ProfileStackNavigationProps } from "../../routes/ProfileNavigator";

import { Feather as Icon } from "@expo/vector-icons";

import ProfileRoundImage from "../../components/ProfileRoundImage";
import TextWithIconButton from "../../components/TextWithIconButton";
import { RectButton } from "react-native-gesture-handler";

interface Props {
  navigation: ProfileStackNavigationProps<"Profile">;
}

class ProfileScreen extends React.Component<Props> {
  componentDidMount() {
    console.log("ProfileScreen componentDidMount");
  }

  componentWillUnmount() {
    console.log("ProfileScreen componentWillUnmount");
  }

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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {"내 정보"}
            </Text>
            <RectButton onPress={() => {}}>
              <Text style={styles.title}>{"수정하기"}</Text>
            </RectButton>
          </View>
          <ScrollView>
            <View style={styles.profileArea}>
              <View style={styles.profileImageContainer}>
                <ProfileRoundImage
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
