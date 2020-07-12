import React from "react"
import { View, Text, StyleSheet, ToastAndroid, BackHandler } from "react-native"
import { MainHeader } from "../../components/Header"
import HandleBack from "../../components/HandleBack"

class LobbyScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    console.log(" componentDidMount LobbyScreen")
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount LobbyScreen")
  }

  render() {
    const { navigation } = this.props

    return (
      <>
        <HandleBack />
        <MainHeader
          title="LobbyScreen"
          menuAction={() => navigation.goBack()}
        />
        <View style={{ flex: 1, backgroundColor: "#25365d" }}>
          <Text style={{ fontSize: 30, color: "#fff" }}>LobbyScreen</Text>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
})

export default LobbyScreen
