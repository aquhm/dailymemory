import React from "react";
import { Image } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { DefaultProfileImage } from "../constants/Images";
import BadgeIcon, { DirectionType } from "../components/BadgeIcon";

interface ProfileRoundImageProps {
  size: number;
  showEditIcon?: boolean;
  onPress?: () => void;
}

const ProfileRoundImage = ({ size, showEditIcon, onPress }: ProfileRoundImageProps) => {
  const editIcon = showEditIcon ? <BadgeIcon size={20} name="settings" /> : null;

  return (
    <BorderlessButton style={{ height: size, width: size, borderRadius: size / 2 }} {...{ onPress }}>
      <Image source={DefaultProfileImage} style={{ height: size, width: size, borderRadius: size / 2 }} />
      {editIcon}
    </BorderlessButton>
  );
};

ProfileRoundImage.defaultProps = {
  name: "",
  onPress: undefined,
};

export default ProfileRoundImage;
