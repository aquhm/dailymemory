import React from "react"
import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { MainHeader } from "../../components/Header"

class DiaryScreen extends React.Component {
  componentDidMount() {
    console.log(" componentDidMount DiaryScreen")
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount DiaryScreen")
  }

  render() {
    const { navigation } = this.props

    return (
      <>
        <MainHeader
          title="DiaryScreen"
          menuAction={() => navigation.goBack()}
        />
        <View style={{ flex: 1, backgroundColor: "#25365d" }}>
          <Text style={{ fontSize: 30, color: "#fff" }}>DiaryScreen</Text>
        </View>
      </>
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

export default DiaryScreen
