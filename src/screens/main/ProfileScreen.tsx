import React from "react"
import { View, Text, StyleSheet } from "react-native"

import { MainStackNavigationProps } from "../../routes/MainStack"

interface Props {
  navigation: MainStackNavigationProps<"Profile">
}

class ProfileScreen extends React.Component<Props> {
  componentDidMount() {
    console.log(" componentDidMount ProfileScreen")
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount ProfileScreen")
  }

  render() {
    return (
      <View>
        <Text>ProfileScreen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ProfileScreen
