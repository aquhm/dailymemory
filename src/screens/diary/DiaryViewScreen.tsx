import React, { createRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  UserInformationStackNavigationProps,
  UserInformationStackRouteProps,
} from "../../routes/UserInformationNavigator";

import { observer, inject } from "mobx-react";

import CenterMenuPopup, { BaseItem } from "../../components/CenterMenuPopup";

import { PanGestureHandler, RectButton, ScrollView } from "react-native-gesture-handler";
import ImageApi from "../../apis/Image/ImageApi";
import * as _ from "lodash";

import RootStore from "../../stores/RootStore";
import DiaryStore from "../../stores/DiaryStore";
import DiaryRecordStore, { DiaryRecord } from "../../stores/DiaryRecordStore";

import Animated from "react-native-reanimated";
import Swiper, { SwiperInternals } from "react-native-swiper";

const { width, height } = Dimensions.get("window");
const imageHeight = height * 0.6;
const editWidth = width * 0.8;

const menuData: BaseItem[] = [
  {
    id: 1,
    title: "사진 보관함에서 선택",
  },

  {
    id: 2,
    title: "사진 촬영",
  },
];

interface Props {
  navigation: UserInformationStackNavigationProps<"DiaryView">;
  route: UserInformationStackRouteProps<"DiaryView">;
  diaryRecordStore: DiaryRecordStore;
}

@inject("diaryRecordStore")
@observer
class DiaryViewScreen extends React.Component<Props> {
  centerMenuPopupRef = createRef<typeof CenterMenuPopup>();

  constructor(props: Props) {
    super(props);

    this.props.navigation.addListener("focus", () => {
      console.log(`${DiaryViewScreen} focus`);

      const { diaryId } = this.props.route.params;
      this.props.diaryRecordStore.getDiaryList(diaryId);
    });

    this.props.navigation.addListener("blur", () => {
      console.log(`${DiaryViewScreen} blur`);
    });
  }

  componentDidMount() {
    console.log(`${DiaryViewScreen} componentDidMount`);
  }

  componentWillUnmount() {
    console.log(`${DiaryViewScreen} componentWillUnmount`);
  }

  onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>, state: SwiperInternals, swiper: Swiper) => {
    console.log(e, state);
  };

  footer = () => {};
  contents = () => {
    const diaryValues = this.props.diaryRecordStore.values.slice();

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Swiper
          loop={false}
          onIndexChanged={(index) => {}}
          loadMinimal={true}
          showsPagination={false}
          bounces={true}
          showsHorizontalScrollIndicator={true}
          automaticallyAdjustContentInsets={true}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          {diaryValues.map((value) => (
            <View style={{ flex: 1 }}>
              <View key={value.documentId} style={styles.picture}>
                <Image source={{ uri: value.imageUri }} style={styles.image} />
              </View>
              <Text style={{ margin: 10, maxHeight: 100 }}>{value.contents}</Text>
              <Text style={{ margin: 10, textAlign: "right" }}>{value.memoryTime}</Text>
            </View>
          ))}
        </Swiper>
      </View>
    );
  };

  renderRecordImage = () => {};

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.contents()}
          {this.footer()}
          <CenterMenuPopup ref={this.centerMenuPopupRef} data={menuData} />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  picture: {
    width,
    height: imageHeight,
    overflow: "hidden",
  },
});

export default DiaryViewScreen;
