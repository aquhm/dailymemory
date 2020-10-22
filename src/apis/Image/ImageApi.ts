import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Firebase from "../../utility/Firebase";
import * as firebase from "firebase/app";

import { Platform } from "react-native";
import { StorageImagePathType } from "../../constants/StoragePath";
import { v4 as uuid } from "uuid";

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

  public static makeStorageFilePath(targetPath: string, imageUri: string) {
    const a = ".";
    const fileExtension = imageUri.split(a).pop();
    const fileName = `${uuid()}.${fileExtension}`;
    return `${targetPath}/${fileName}`;
  }

  public static async uploadImageAsync(
    targetStoragePath: string,
    imageUri: string,
    uploadCompleted?: (downloadUrl: string) => void
  ) {
    try {
      var ref = Firebase.Instance.storage.ref().child(targetStoragePath);

      const response = await fetch(imageUri);
      const blob = await response.blob();

      ref.put(blob).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          console.log("snapshot: " + snapshot.state);
          console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          if (snapshot.state == firebase.storage.TaskState.SUCCESS) {
            console.log("upload Success");
          }
        },
        (error) => {
          console.log("upload error: " + error.message);
        },
        () => {
          ref.getDownloadURL().then((url) => {
            //this.setProfileImage(url);

            uploadCompleted && uploadCompleted(url);
          });
        }
      );
    } catch (error) {
      throw new Error(`Function [${this.uploadImageAsync.name}] ${error}`);
    }
  }

  public static async removeImageAsync(
    targetPath: StorageImagePathType,
    imageUri: string,
    removeCompleted?: () => void
  ) {
    try {
      var ref = Firebase.Instance.storage.ref().child(imageUri);

      ref
        .delete()
        .then(() => {
          removeCompleted && removeCompleted();
        })
        .catch((error) => {
          throw new Error(`Function [${this.removeImageAsync.name}] ${error}`);
        });
    } catch (E) {
      console.log(E);
    }
  }
}

export { StorageImagePathType };
export default ImageApi;
