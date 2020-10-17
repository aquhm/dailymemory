import React, { createRef, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ToastAndroid,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  UserInformationStackNavigationProps,
  UserInformationStackRouteProps,
} from "../../routes/UserInformationNavigator";

import { observer, inject } from "mobx-react";

import CenterMenuPopup, { BaseItem } from "../../components/CenterMenuPopup";

import { PanGestureHandler, BorderlessButton, RectButton, ScrollView } from "react-native-gesture-handler";

import * as _ from "lodash";

import RootStore from "../../stores/RootStore";
import DiaryStore, { Diary } from "../../stores/DiaryStore";
import DiaryRecordStore, { DiaryRecord } from "../../stores/DiaryRecordStore";

import Swiper, { SwiperInternals } from "react-native-swiper";
import ProfileRoundImage from "../../components/ProfileRoundImage";
import DiaryCoverBarFooter from "./component/DiaryCoverBarFooter";
import { DefaultProfileImage } from "../../constants/Images";

import { Feather as Icon } from "@expo/vector-icons";
import IconButton from "../../components/IconButton";

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

interface State {
  currentIndex: number;
}

interface Props {
  navigation: UserInformationStackNavigationProps<"DiaryView">;
  route: UserInformationStackRouteProps<"DiaryView">;
  diaryStore: DiaryStore;
  diaryRecordStore: DiaryRecordStore;
}

@inject("diaryStore")
@inject("diaryRecordStore")
@observer
class DiaryViewScreen extends React.Component<Props, State> {
  centerMenuPopupRef = createRef<typeof CenterMenuPopup>();

  private _currentDiary: Diary | undefined;
  private _swipeRef = createRef<Swiper>();
  constructor(props: Props) {
    super(props);

    this.state = {
      currentIndex: 0,
    };

    this.props.navigation.addListener("focus", () => {
      const { diary } = this.props.route.params;

      this.props.diaryRecordStore.getDiaryList(diary.documentId);
    });

    this.props.navigation.addListener("blur", () => {});
  }

  componentDidMount() {
    console.log(`DiaryViewScreen componentDidMount`);
    this.setState({ currentIndex: 0 });
  }

  componentWillUnmount() {
    console.log(`DiaryViewScreen componentWillUnmount`);
  }

  onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>, state: SwiperInternals, swiper: Swiper) => {};

  onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>, state: SwiperInternals, swiper: Swiper) => {};

  renderCoverFooter = (diary?: Diary) => {
    const showToast = () => {
      ToastAndroid.show("메뉴 준비중입니다.", ToastAndroid.SHORT);
    };

    return (
      <DiaryCoverBarFooter
        onPrevPress={() => this.props.navigation.goBack()}
        right={{
          buttons: [
            <IconButton
              name="edit-2"
              size={20}
              color="white"
              onPress={() => this.props.navigation.navigate("Diary")}
            />,
            <IconButton name="more-vertical" size={20} onPress={() => showToast()} />,
          ],
        }}
      />
    );
  };

  renderDiaryFooter = (diaryRecord?: DiaryRecord) => {
    const showToast = () => {
      ToastAndroid.show("메뉴 준비중입니다.", ToastAndroid.SHORT);
    };

    const onPressPrev = () => {
      //@ts-ignore
      this._swipeRef.current.scrollBy(-1, true);
    };

    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 40,
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <View>
          <BorderlessButton onPress={() => onPressPrev()}>
            <Icon name="chevron-left" color="white" size={20} />
          </BorderlessButton>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ margin: 5 }}>
            <BorderlessButton onPress={() => this.props.navigation.navigate("Diary")}>
              <Icon name="edit-2" color="white" size={20} />
            </BorderlessButton>
          </View>
          <View style={{ margin: 5 }}>
            <BorderlessButton onPress={() => showToast()}>
              <Icon name="more-vertical" color="white" size={20} />
            </BorderlessButton>
          </View>
        </View>
      </View>
    );
  };

  cover = () => {
    const { diary } = this.props.route.params;
    if (diary != null) {
      return (
        <View style={styles.container}>
          <View key={diary.documentId} style={styles.picture}>
            <Image source={{ uri: diary.coverImageUri }} style={styles.image} />
            <View style={{ ...StyleSheet.absoluteFillObject, flexDirection: "column-reverse" }}>
              <View style={styles.profileArea}>
                <ProfileRoundImage
                  imageUri={RootStore.Instance.AuthStore.profileImageUri ?? DefaultProfileImage}
                  size={50}
                />
                <Text style={{ margin: 10 }}>{RootStore.Instance.AuthStore.user.name}</Text>
              </View>
            </View>
          </View>
          <Text style={{ margin: 10, maxHeight: 100 }}>{diary.title}</Text>
          {/*this.renderCoverFooter(diary)*/}
        </View>
      );
    }
  };
  renderContents = () => {
    const diaryValues = this.props.diaryRecordStore.values.slice();

    const diaryList = diaryValues.map((value, _) => (
      <View style={styles.container}>
        <View key={value.documentId} style={styles.picture}>
          <Image source={{ uri: value.imageUri }} style={styles.image} />
        </View>
        <Text style={{ margin: 10, maxHeight: 100 }}>{value.contents}</Text>
        <Text style={{ margin: 10, textAlign: "right" }}>{value.memoryTime}</Text>

        {/*this.renderDiaryFooter(value)*/}
      </View>
    ));

    const renderList = [this.cover(), ...diaryList];
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Swiper
          ref={this._swipeRef}
          loop={false}
          onIndexChanged={(index) => {
            this.setState({ currentIndex: index });
          }}
          index={0}
          loadMinimal={true}
          showsPagination={false}
          bounces={true}
          showsHorizontalScrollIndicator={true}
          automaticallyAdjustContentInsets={true}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          {renderList}
        </Swiper>
      </View>
    );
  };

  renderRecordImage = () => {};

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
          {this.renderContents()}
          {this.state.currentIndex == 0 ? this.renderCoverFooter() : this.renderDiaryFooter()}
          <CenterMenuPopup ref={this.centerMenuPopupRef} data={menuData} />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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

  profileArea: {
    height: 60,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(100,100,100,0.3)",
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
  },
  profileImageContainer: {
    opacity: 1.0,
  },
});

export default DiaryViewScreen;
