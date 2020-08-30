import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Title } from "react-native-paper";
import PropTypes from "prop-types";

import Theme from "../constants/Styles";

function Input(props) {
  const { title, password } = props;
}

Input.defaultProps = {
  title: null,
  backTarget: null,
};

Input.propTypes = {
  title: PropTypes.string,
  backTarget: PropTypes.string,
};

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
    color: Theme.COLOR.TiTLE,
  },
});

export default Input;
