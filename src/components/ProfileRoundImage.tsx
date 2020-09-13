import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";
import { DefaultProfileImage } from "../constants/Images";

import * as _ from "lodash";

import BadgeIcon, { DirectionType } from "../components/BadgeIcon";

interface ProfileRoundImageProps {
  imageUri?: string;
  size: number;
  showEditIcon?: boolean;
  editing?: boolean;
  onPress?: () => void;
}

const ProfileRoundImage = ({ imageUri, size, showEditIcon, editing, onPress }: ProfileRoundImageProps) => {
  const editIcon = showEditIcon ? <BadgeIcon size={20} name="settings" /> : null;
  const overlayIconSize = size * 0.4;
  const editingOverlay = editing ? (
    <View style={[styles.editingOverlay, { height: size, width: size, borderRadius: size / 2 }]}>
      <Icon size={overlayIconSize} name="camera" color="white" />
    </View>
  ) : null;

  return (
    <BorderlessButton style={{ height: size, width: size, borderRadius: size / 2 }} {...{ onPress }}>
      <Image
        source={_.isEmpty(imageUri) == false ? { uri: imageUri } : DefaultProfileImage}
        style={{ height: size, width: size, borderRadius: size / 2 }}
      />
      {editIcon}
      {editingOverlay}
    </BorderlessButton>
  );
};

ProfileRoundImage.defaultProps = {
  imageUri: "",
  name: "",
  editing: false,
  onPress: undefined,
};

const styles = StyleSheet.create({
  editingOverlay: {
    position: "absolute",
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
});

export default ProfileRoundImage;
