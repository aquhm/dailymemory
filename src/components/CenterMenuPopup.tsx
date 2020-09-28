import React, { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import {
  Text,
  Modal,
  Dimensions,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

const { width, height } = Dimensions.get("window");

const popupHeight = height * 0.3;
const popupWidth = width * 0.6;

export interface BaseItem {
  id: number;
  title: string;
  onPress?: () => void;
}

export interface BaseIconItem extends BaseItem {
  icon?: string;
}

interface CenterMenuPopupProps<T> {
  data: T[];

  onTouchOutside?: boolean;
}

const renderItem = (listRenderItemInfo: ListRenderItemInfo<BaseIconItem>) => {
  return (
    <TouchableWithoutFeedback onPress={listRenderItemInfo.item.onPress}>
      <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: 50 }}>
        <Text>{listRenderItemInfo.item.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const CenterMenuPopup = forwardRef(({ data, onTouchOutside }: CenterMenuPopupProps<BaseItem>, ref?: React.Ref<any>) => {
  const [active, setActive] = useState<boolean>(false);

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
        onPress={() => {
          setActive(false);
        }}
      >
        {view}
      </TouchableWithoutFeedback>
    );
  };

  const renderSetperator = () => {
    return <View style={{ backgroundColor: "gray", height: StyleSheet.hairlineWidth }}></View>;
  };

  const renderContent = () => {
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
  return (
    <Modal animationType={"fade"} transparent visible={active} onRequestClose={close}>
      {renderOutsideTouchable(close)}
      <View style={[styles.container]}>
        <View style={[styles.popup, { height: data.length * 62 }]}>{renderContent()}</View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: popupWidth,
  },
});

CenterMenuPopup.defaultProps = {
  onTouchOutside: true,
};

export default CenterMenuPopup;
