import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { HomeNavigationProps } from "../../routes/HomeNavigator";

interface Props {
  navigation: HomeNavigationProps<"Home", "Subscribe">;
}

class SubscribeScreen extends React.Component<Props> {
  componentDidMount() {
    console.log(" componentDidMount SubscribeScreen");
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount SubscribeScreen");
  }

  render() {
    return (
      <View>
        <Text>SubscribeScreen</Text>
      </View>
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

export default SubscribeScreen;
