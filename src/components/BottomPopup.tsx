import React, { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import {
  Text,
  Modal,
  Dimensions,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
} from "react-native";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import Animated, { Easing } from "react-native-reanimated";

export interface BaseItem {
  id: number;
  title: string;
  onPress?: () => void;
}

export interface BaseIconItem extends BaseItem {
  icon?: string;
}

interface BottomPopupProps<T> {
  title?: string;
  data?: T[];

  onTouchOutside?: boolean;
}

const renderItem = (listRenderItemInfo: ListRenderItemInfo<BaseIconItem>) => {
  return (
    <RectButton onPress={listRenderItemInfo.item.onPress}>
      <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: 50, padding: 5 }}>
        <Text>{listRenderItemInfo.item.title}</Text>
      </View>
    </RectButton>
  );
};

const BottomPopup = forwardRef(
  ({ title, data, onTouchOutside }: BottomPopupProps<BaseIconItem>, ref?: React.Ref<any>) => {
    const [active, setActive] = useState<boolean>(true);
    const deviceHeight = Dimensions.get("window").height * 0.25;

    const close = () => {
      setActive(false);
    };

    useImperativeHandle(
      ref,
      () => ({
        open() {
          setActive(true);
        },
      }),
      []
    );
    const [yPosition] = useState(new Animated.Value(Dimensions.get("screen").height));

    const _resetPositionAnim = Animated.timing(yPosition, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
    });

    const closeAnim = Animated.timing(yPosition, {
      toValue: Dimensions.get("window").height,
      duration: 500,
      easing: Easing.linear,
    });

    const renderOutsideTouchable = (onTouch?: () => void) => {
      const view = <View style={{ flex: 1, width: "100%", backgroundColor: "black", opacity: 0.0 }} />;

      if (!onTouch) return view;

      return (
        <TouchableWithoutFeedback
          onPress={() => {
            setActive(false);
          }}
          style={{ flex: 1, width: "100%" }}
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

    const renderSetperator = () => {
      return <View style={{ backgroundColor: "gray", height: StyleSheet.hairlineWidth }}></View>;
    };

    const renderContent = () => {
      console.log("BottomPopup renderContent");

      return (
        <View>
          <FlatList
            style={{ marginBottom: 20 }}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            extraData={data}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={renderSetperator}
            contentContainerStyle={{ paddingBottom: 40 }}
          ></FlatList>
        </View>
      );
    };

    const top1 = yPosition.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0, 0, 1],
    });

    const getTransform = () => {
      return {
        transform: [{ translateY: top1 }],
      };
    };
    return (
      <Modal animationType={"fade"} transparent visible={active} onRequestClose={close}>
        {renderOutsideTouchable(close)}
        <View style={[styles.container, { maxHeight: deviceHeight }]}>
          <View style={styles.popup}>
            {renderTitle()}
            {renderContent()}
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignSelf: "center",
    width: "80%",
  },
  popup: {
    backgroundColor: "#FFF",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 10,
  },

  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: "500",
    margin: 10,
  },

  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

BottomPopup.defaultProps = {
  title: "",
  onTouchOutside: true,
  //renderItem: (): React.ReactElement => <View />,
};

export default BottomPopup;
