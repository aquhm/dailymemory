import React from "react"
import { View, StyleSheet } from "react-native"
import { Appbar, Title } from "react-native-paper"
import PropTypes from "prop-types"

import Theme from "../constants/Styles"

const AuthHeader = (props) => {
  console.log("AuthHeader props = " + JSON.stringify(props))
  const { title, backAction, menuAction } = props

  return (
    <Appbar.Header style={styles.headerContainer}>
      {
        /*<Appbar.BackAction onPress={() => navigation.navigate(backTarget)} />*/
        <Appbar.BackAction onPress={backAction} />
      }

      <View style={styles.container}>
        <Title style={styles.title}>{title}</Title>
      </View>
      <Appbar.Action icon="menu" onPress={menuAction} />
    </Appbar.Header>
  )
}

const MainHeader = (props) => {
  console.log("MainHeader props = " + JSON.stringify(props))
  const { title, menuAction } = props

  return (
    <Appbar.Header style={styles.headerContainer}>
      <Appbar.Action icon="menu" onPress={menuAction} />
      <View style={styles.container}>
        <Title style={styles.title}>{title}</Title>
      </View>
    </Appbar.Header>
  )
}

AuthHeader.defaultProps = {
  title: null,
  backAction: null,
  menuAction: null,
}

AuthHeader.propTypes = {
  title: PropTypes.string,
  backAction: PropTypes.func,
  menuAction: PropTypes.func,
}

MainHeader.defaultProps = {
  title: null,
  menuAction: null,
}

MainHeader.propTypes = {
  title: PropTypes.string,
  menuAction: PropTypes.func,
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Theme.COLOR.INFO,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: Theme.COLOR.TITLE,
  },
})

export { AuthHeader, MainHeader }
