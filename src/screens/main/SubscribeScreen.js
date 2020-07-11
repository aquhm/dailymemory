import React from "react"
import { View, Text, StyleSheet } from "react-native"

class SubscribeScreen extends React.Component {
  componentDidMount() {
    console.log(" componentDidMount SubscribeScreen")
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount SubscribeScreen")
  }

  render() {
    return (
      <View>
        <Text>SubscribeScreen</Text>
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

export default SubscribeScreen
