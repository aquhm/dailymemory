import { ToastAndroid, Alert, BackHandler, NativeEventSubscription } from "react-native";
import * as common from "./common";
import { RootStore } from "../stores";

class AndroidBackButtonHandler {
  static _instance?: AndroidBackButtonHandler;
  private _exitApp: boolean = false;
  private _timeout?: NodeJS.Timeout;
  private _latestBackHandler?: NativeEventSubscription;
  private _backAction?: () => boolean;

  public static get Instance() {
    if (!this._instance) {
      this._instance = new AndroidBackButtonHandler();
      return this._instance;
    } else {
      return this._instance;
    }
  }
  private constructor() {}

  get getLastestBackHandler() {
    return this._latestBackHandler;
  }

  handleAndroidBackButton = (callBack: () => any = this.exitSecondTimeAlert) => {
    common.getFunctionCallerName();

    this._backAction = () => {
      callBack();
      return true;
    };

    this._latestBackHandler = BackHandler.addEventListener("hardwareBackPress", this._backAction);

    return this._latestBackHandler;
  };

  removeAndroidBackButtonHandler = () => {
    common.getFunctionCallerName();

    this._latestBackHandler?.remove();

    if (this._backAction != null) {
      BackHandler.removeEventListener("hardwareBackPress", this._backAction);
    } else {
    }

    console.log("removeAndroidBackButtonHandler = " + this.getLastestBackHandler);
  };

  exitSecondTimeAlert = () => {
    if (!this._exitApp) {
      ToastAndroid.show("한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT);
      this._exitApp = true;

      this._timeout = setTimeout(
        () => {
          this._exitApp = false;
        },
        2 * 1000 // 2초
      );
    } else {
      if (this._timeout != null) {
        clearTimeout(this._timeout);
      }

      ToastAndroid.show("", 0);

      RootStore.Instance.AuthStore.SignOut().then(() => {
        BackHandler.exitApp(); // 앱 종료
        console.log("AndroidBackButtonHandler signOut success");
      });
    }
  };

  exitAlert = () => {
    Alert.alert("Confirm exit", "Do you want to quit the app?", [
      { text: "CANCEL", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          RootStore.Instance.AuthStore.SignOut().then(() => {
            BackHandler.exitApp(); // 앱 종료
            console.log("AndroidBackButtonHandler signOut success");
          });
        },
      },
    ]);
  };
}

export default AndroidBackButtonHandler;
