import React from "react"
import { StackNavigationProp } from "@react-navigation/stack"
import {
  NavigationContainer,
  CompositeNavigationProp,
} from "@react-navigation/native"
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native"

import { AuthStackNavigationProps } from "../../routes/AuthStack"

import { LinearGradient } from "expo-linear-gradient"
//import { Ionicons } from "@expo/vector-icons"
import { SocialIcon, Button } from "react-native-elements"
import Icon from "react-native-vector-icons/MaterialIcons"

import Iamges from "../../constants/Images"
import Theme from "../../constants/Styles"

//import LoginButton from "../../components/LoginButton"

interface Props {
  navigation: AuthStackNavigationProps<"SignUp">
}
const { height, width } = Dimensions.get("window")

class LoginScreen extends React.Component<Props> {
  constructor(props: Props) {
    console.log("LoginScreen")
    super(props)
  }

  render() {
    const navigate = this.props.navigation.navigate

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[
            Theme.COLOR.BACKGROUND_GRADIENT_START,
            Theme.COLOR.BACKGROUND_GRADIENT_MIDDLE,
            Theme.COLOR.BACKGROUND_GRADIENT_END,
          ]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
          }}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Daily Memory</Text>
          <Text style={styles.subTitle}>write your memory</Text>
        </View>

        <View style={styles.titleImageContainer}>
          <Image style={styles.titleImage} source={Iamges.LoginTitle} />
        </View>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <View style={styles.socialButton}>
              <SocialIcon
                button
                title="Sign In Google"
                type="google"
                onPress={() => {
                  alert("google")
                }}
              />
            </View>
            <View style={styles.socialButton}>
              <SocialIcon
                button
                title="Sign In Facebook"
                type="facebook"
                onPress={() => {
                  alert("facebook")
                }}
              />
            </View>
            <View style={styles.emailButton}>
              <Button
                icon={<Icon name="email" size={20} color="white" />}
                /*iconLeft*/
                title="  Sign In Email"
                onPress={() => navigate("SignIn")}
              />
            </View>
          </View>
        </View>
      </View>
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
  titleContainer: {
    flex: 0.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    alignContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  subTitle: {
    fontSize: 12,
    fontWeight: "200",
    textAlign: "center",
  },

  titleImageContainer: {
    flex: 1.3,
    marginTop: 20,
    flexDirection: "row",
    marginHorizontal: 20,
  },

  titleImage: {
    width: "100%",
    height: "100%",
  },

  footer: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "flex-start",
    alignContent: "center",
  },

  buttonContainer: {
    width: width * 0.9,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    alignContent: "center",
  },

  socialButton: {
    width: "100%",
    height: 44,
    marginBottom: 20,
  },

  emailButton: {
    width: width * 0.85,
    height: 40,
    borderRadius: 40 / 2,
    marginVertical: 10,
  },
})

export default LoginScreen
