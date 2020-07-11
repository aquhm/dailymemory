import React from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"

class LoadingScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>Loading...</Text>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default LoadingScreen
