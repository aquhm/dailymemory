import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";

class ImageApi {
  private constructor() {}
  public static changeProfileImageAsync = async () => {
    await ImageApi.getPermissionAsync();
    return await ImageApi.pickImageAsync();
  };

  public static changeProfileImageByCameraAsync = async () => {
    await ImageApi.getPermissionAsync();
    return await ImageApi.cameraImageAsync();
  };

  private static getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    }
  };

  private static pickImageAsync = async () => {
    let result;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      console.log(result);
    } catch (E) {
      console.log(E);
    }
    return result;
  };

  private static cameraImageAsync = async () => {
    let result;
    try {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });
      console.log(result);
    } catch (E) {
      console.log(E);
    }

    return result;
  };
}

export default ImageApi;
