import React from "react";
import { View, StyleSheet } from "React-Native";
import LoginButton from "./LoginButton";
import LoginManager from "../managers/LoginManager";

class LoginButtonList extends React.Component {
  render() {
    return <View style={styles.container}></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 6,
    marginVertical: 12,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginButtonList;
