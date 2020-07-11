import React from "react"
import { View, Text, StyleSheet } from "react-native"

class NoticeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.props.navigation.addListener("didFocus", () => {
      console.log(" focus NoticeScreen")
    })

    this.props.navigation.addListener("didBlur", () => {
      console.log(" blur NoticeScreen")
    })
  }
  componentDidMount() {
    console.log(" componentDidMount NoticeScreen")
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount NoticeScreen")
  }

  render() {
    return (
      <View>
        <Text>NoticeScreen</Text>
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

export default NoticeScreen
