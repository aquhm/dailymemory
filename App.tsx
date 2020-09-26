import React from "react";
import { AppState } from "react-native";
import { AppLoading } from "expo";
import * as Font from "expo-font";
//import { configure } from 'mobx'
import RouteContainer from "./src/routes/AppNavigator";
import StoreContainer from "./src/stores";
import { useRoute } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
//import { ThemeProvider } from "react-native-elements"
//import antoutline from '@ant-design/icons-react-native/fonts/antoutline.ttf'
//import antfill from '@ant-design/icons-react-native/fonts/antfill.ttf'

//configure({ enforceActions: "always" })

import rootStore from "./src/stores/RootStore";
import { AppearanceProvider } from "react-native-appearance";
import { Provider as MobxProvider } from "mobx-react";
import Firebase from "./src/Firebase";
import RootStore from "./src/stores/RootStore";
import AuthStore from "./src/stores/RootStore";

interface State {
  isReady: boolean;
}

export default class App extends React.Component<{}, State> {
  state = {
    isReady: true,
  };
  constructor(props: {}) {
    super(props);
    console.log("App constructor");

    RootStore.Instance.Initialize();
  }

  /*Todo 
  assets load
  */
  //loadAssets = async () => {
  //  //await Font.loadAsync({...Ionicons.font, })
  //  //await Font.loadAsync({ ...Ionicons.font })
  //  //await Font.loadAsync({ ...Ionicons.font })
  //}

  handleAppStateChange = (nextAppState: any) => {
    if (nextAppState === "inactive") {
      Firebase.Instance.signOut();
      console.log("the app is closed");
    }
  };

  componentDidMount() {
    console.log("componentDidMount App");

    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount App");

    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  render() {
    return this.state.isReady ? (
      //<StoreContainer>
      //<ThemeProvider>
      //<MobxProvider {...RootStore.Instance}>
      <MobxProvider rootStore={RootStore.Instance} authStore={RootStore.Instance.AuthStore}>
        <SafeAreaProvider>
          <RouteContainer />
        </SafeAreaProvider>
      </MobxProvider>
    ) : (
      //</ThemeProvider>
      //</StoreContainer>
      <AppLoading
        //startAsync={this._cacheResourcesAsync}
        onFinish={() => this.setState({ isReady: true })}
        onError={console.warn}
      />
    );
  }
}
