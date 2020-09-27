import React, { createRef } from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar, Dimensions } from "react-native";

import { HomeNavigationProps } from "../../routes/HomeNavigator";
import Header from "../../components/common/Header";
import LineTextInput from "../../components/Form/LineTextInput";

const { width, height } = Dimensions.get("window");
const editHeight = height * 0.3;
const editWidth = width * 0.8;

interface Props {
  navigation: HomeNavigationProps<"Home", "Diary">;
}

class DiaryScreen extends React.Component<Props> {
  lienTextRef = createRef<typeof LineTextInput>();

  componentDidMount() {
    console.log(" componentDidMount DiaryScreen");
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount DiaryScreen");
  }

  header = () => {
    return (
      <Header
        title="일기"
        color="black"
        left={{
          icon: "arrow-left",
          onPress: () => {
            this.props.navigation.goBack();
          },
          visible: true,
        }}
        right={{
          icon: "check",
          onPress: () => {},
          visible: true,
        }}
      />
    );
  };

  render() {
    console.log(`DiaryScreen render() editHeight = ${editHeight}`);

    return (
      <>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }}>
          {this.header()}
          <View style={styles.container}>
            <View style={styles.textEditcontainer}>
              <View style={{ flex: 1 }}>
                <LineTextInput
                  ref={this.lienTextRef}
                  lineWidth={editWidth}
                  line={3}
                  lineLeading={24}
                  size={14}
                  lineColor="black"
                  placeholder="일상을 남겨주세요."
                />
                <View style={{ flex: 1, flexDirection: "row-reverse", marginTop: 30, justifyContent: "space-between" }}>
                  <View>
                    <Text>2020년 9월 27일</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.imageEditcontainer}></View>
          </View>
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

  textEditcontainer: {
    flex: 1,
    justifyContent: "flex-start",
  },

  imageEditcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DiaryScreen;
