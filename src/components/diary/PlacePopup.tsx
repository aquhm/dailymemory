import React, { useState, useImperativeHandle, useLayoutEffect, forwardRef, useRef } from "react";
import { Text, Modal, Dimensions, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { BorderlessButton, RectButton, TextInput } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import Animated, { Easing } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const popupHeight = height * 0.3;
const popupWidth = width * 0.6;

interface PlacePopupProps {
  title?: string;
  okTitle?: string;
  cancelTitle?: string;
  visible?: boolean;
  onTouchOutside?: boolean;

  ok?: (message: string) => void;
  cancel?: () => void;
}

const PlacePopup = forwardRef(
  ({ title, okTitle, cancelTitle, onTouchOutside, ok, cancel, ...props }: PlacePopupProps, ref?: React.Ref<any>) => {
    const textInputRef = useRef<TextInput>(null);

    const [active, setActive] = useState<boolean>(false);
    const [placeText, setPlaceText] = useState<string>("");

    useLayoutEffect(() => {
      //@ts-ignore
      textInputRef.current?.clear();
    }, [active]);

    const close = () => {
      setActive(false);
    };

    useImperativeHandle(
      ref,
      () => ({
        open() {
          setActive(true);
        },
        close() {
          setActive(false);
        },
      }),
      []
    );

    const renderOutsideTouchable = (onTouch?: () => void) => {
      const view = <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "black", opacity: 0.7 }} />;

      if (!onTouch) return view;

      return (
        <TouchableWithoutFeedback
          style={{ flex: 1, width: "100%" }}
          onPress={() => {
            setActive(false);
          }}
        >
          {view}
        </TouchableWithoutFeedback>
      );
    };

    const renderTitle = () => {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>{title}</Text>
        </View>
      );
    };

    const renderButtons = () => {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: 100, height: 50, justifyContent: "center", alignItems: "center" }}>
            <TouchableWithoutFeedback
              onPress={() => {
                setActive(false);
              }}
            >
              <Text style={{ justifyContent: "center", alignItems: "center" }}>{cancelTitle}</Text>
            </TouchableWithoutFeedback>
          </View>

          <View style={{ height: 50, justifyContent: "center" }}>
            <Text>/</Text>
          </View>
          <View style={{ width: 100, height: 50, justifyContent: "center", alignItems: "center" }}>
            <TouchableWithoutFeedback
              style={{ width: 100, height: 50, justifyContent: "center", alignItems: "center" }}
              onPress={() => {
                ok && ok(placeText);
                close();
              }}
            >
              <Text style={{ justifyContent: "center", alignItems: "center" }}>{okTitle}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    };

    const renderContent = () => {
      return (
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <TextInput
            ref={textInputRef}
            defaultValue=""
            style={{ height: 24, backgroundColor: "white" }}
            placeholder={"장소를 입력해주세요."}
            onChangeText={(text) => setPlaceText(text)}
            value={placeText}
            {...props}
          />
          <Text> 에서</Text>
        </View>
      );
    };

    return (
      <Modal animationType={"fade"} transparent visible={active} onRequestClose={close}>
        {renderOutsideTouchable(close)}
        <View style={[styles.container]}>
          <View style={styles.popup}>
            {renderTitle()}
            {renderContent()}
            {renderButtons()}
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    height: popupHeight,
    width: popupWidth,
  },

  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: "500",
    margin: 10,
  },
});

PlacePopup.defaultProps = {
  title: "장소",
  onTouchOutside: true,
  okTitle: "확인",
  cancelTitle: "취소",
  visible: false,
};

export default PlacePopup;
