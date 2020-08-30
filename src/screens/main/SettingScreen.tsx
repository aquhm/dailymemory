import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { MainHeader } from "../../components/Header";

import { HomeNavigationDrawProps } from "../../routes/HomeNavigator";

interface Props {
  navigation: HomeNavigationDrawProps<"Setting">;
}

class SettingScreen extends React.Component<Props> {
  componentDidMount() {
    console.log(" componentDidMount SettingScreen");
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount SettingScreen");
  }

  render() {
    const navigation = this.props.navigation;

    return (
      <>
        <MainHeader title="SettingScreen" menuAction={() => navigation.goBack()} />
        <View style={{ flex: 1, backgroundColor: "#25365d" }}>
          <Text style={{ fontSize: 30, color: "#fff" }}>SettingScreen</Text>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingScreen;
