import { ToastAndroid } from "react-native";

class UiHelper {
  private constructor() {}

  /*Todo
  임시 추후 LocaleString System 적용 후 변경 예정
  */
  public static notReadyContensToastMessage = () => {
    ToastAndroid.show("준비 중입니다.", ToastAndroid.SHORT);
  };
}

export default UiHelper;
