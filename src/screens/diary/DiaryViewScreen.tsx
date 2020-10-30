import React, { createRef } from "react";

import { View, StyleSheet, SafeAreaView, StatusBar, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

import { UserInformationStackNavigationProps, UserInformationStackRouteProps } from "../../routes/UserInformationNavigator";

import { observer, inject } from "mobx-react";

import CenterMenuPopup, { BaseItem } from "../../components/CenterMenuPopup";

import * as _ from "lodash";

import { DiaryStore, DiaryPageStore } from "../../stores";

import Swiper, { SwiperInternals } from "react-native-swiper";
import { DiaryCoverPage, DiaryViewPage } from "./component";

const { width, height } = Dimensions.get("window");
const imageHeight = height * 0.6;

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
  diaryPageStore: DiaryPageStore;
}

@inject("diaryStore")
@inject("diaryPageStore")
@observer
class DiaryViewScreen extends React.Component<Props, State> {
  private _centerMenuPopupRef = createRef<typeof CenterMenuPopup>();
  private _swipeRef = createRef<Swiper>();

  constructor(props: Props) {
    super(props);

    this.state = {
      currentIndex: 0,
    };

    this.props.navigation.addListener("focus", () => {
      const { diary } = this.props.route.params;
      this.props.diaryPageStore.getListAsync(diary.Record.documentId);
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

  renderPages = () => {
    const { diary } = this.props.route.params;
    const diaryPageRecords = this.props.diaryPageStore.Values.slice();

    const cover = <DiaryCoverPage key={diary.Record.documentId} {...{ diary }} navigation={this.props.navigation} />;

    const onPressPrev = () => {
      //@ts-ignore
      this._swipeRef.current.scrollBy(-1, true);
    };

    const diaryList = diaryPageRecords.map((diaryPageRecord, _) => (
      <DiaryViewPage key={diaryPageRecord.documentId} {...{ diaryPageRecord }} navigation={this.props.navigation} onPress={() => onPressPrev()} />
    ));

    const renderList = [cover, ...diaryList];
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

  render() {
    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
          {this.renderPages()}
          <CenterMenuPopup ref={this._centerMenuPopupRef} data={menuData} />
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
