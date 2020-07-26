import React from "react"
import { View, Text, StyleSheet } from "react-native"

import { MainStackNavigationProps } from "../../routes/MainStack"

interface Props {
  navigation: MainStackNavigationProps<"Notice">
}

class NoticeScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.props.navigation.addListener("focus", () => {
      console.log(" focus NoticeScreen")
    })

    this.props.navigation.addListener("blur", () => {
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
