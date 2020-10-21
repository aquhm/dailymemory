import { useState, useCallback } from "react";
import { NativeEventSubscription } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AndroidBackButtonHandler from "../utility/AndroidBackButtonHandler";

const HandleBack = () => {
  const [backHandler, setBackHandler] = useState<NativeEventSubscription>();

  const onBack = useCallback(() => {
    if (backHandler != null) backHandler.remove();

    setBackHandler(AndroidBackButtonHandler.Instance.handleAndroidBackButton());

    return () => {
      setBackHandler(undefined);
      AndroidBackButtonHandler.Instance.removeAndroidBackButtonHandler();
      console.log("HandleBack backHandler = " + backHandler);
    };
  }, []);

  useFocusEffect(onBack);

  return null;
};

export default HandleBack;
