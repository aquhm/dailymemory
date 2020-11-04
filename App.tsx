import React from "react";
import { AppState, YellowBox } from "react-native";
import { AppLoading } from "expo";
import RouteContainer from "./src/routes/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider as MobxProvider } from "mobx-react";
import Firebase from "./src/utility/Firebase/Firebase";
import { RootStore } from "./src/stores";

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

    YellowBox.ignoreWarnings(["Setting a timer"]);

    RootStore.Instance.PreInitialize();
  }

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
      <MobxProvider
        rootStore={RootStore.Instance}
        authStore={RootStore.Instance.AuthStore}
        diaryStore={RootStore.Instance.DiaryStore}
        diaryPageStore={RootStore.Instance.DiaryPageStore}
        diaryLobbyStore={RootStore.Instance.DiaryLobbyStore}
      >
        <SafeAreaProvider>
          <RouteContainer />
        </SafeAreaProvider>
      </MobxProvider>
    ) : (
      <AppLoading
        //startAsync={this._cacheResourcesAsync}
        onFinish={() => this.setState({ isReady: true })}
        onError={console.warn}
      />
    );
  }
}
