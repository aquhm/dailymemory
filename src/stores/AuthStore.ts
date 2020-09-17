import { action, observable, computed } from "mobx";
import Firebase from "../Firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import RootStore from "./RootStore";
import { v4 as uuid } from "uuid";

class AuthStore {
  private readonly _profileImageStoragePath: string = "images/profile";

  @observable private _user?: firebase.User;
  @observable private _profileImageUri?: string;

  constructor(private _rootStore: RootStore) {
    console.log("AuthStore");

    Firebase.Instance.setAuthStateChange(this.onAuthStateChanged);
  }

  public Initialize = () => {};

  @action
  private setUser(user?: firebase.User) {
    console.log("AuthStore SetUser " + user);
    this._user = user;
  }

  public get user(): firebase.User {
    if (!this._user) {
      throw new Error(`${AuthStore.name}  user is null`);
    }

    return this._user;
  }

  public get isLogin(): boolean {
    return this._user != null;
  }

  @action
  private setProfileImage = (profileImage: string): void => {
    this._profileImageUri = profileImage;
  };

  private get profileImageUri(): string | undefined {
    return this._profileImageUri;
  }

  private onAuthStateChanged = (user: firebase.User): void => {
    if (user != null) {
      console.log("AuthStore onAuthStateChanged login");
      this.setUser(user);
    } else {
      console.log("AuthStore onAuthStateChanged logout");
      this.setUser(undefined);
    }
  };

  @computed
  get isAuthenticated(): boolean {
    return this._user !== null ? true : false;
  }

  public Login = async (email: string, password: string) => await Firebase.Instance.login(email, password);

  public SignUp = async (name: string, email: string, password: string) =>
    await Firebase.Instance.signUp(name, email, password);

  public SignOut = async () => await Firebase.Instance.auth.signOut();

  public uploadProfileImageAsync = async (imageUri: string, uploadCompleted?: () => void) => {
    try {
      const a = ".";
      const fileExtension = imageUri.split(a).pop();
      console.log("Ext : " + fileExtension);

      const fileName = `${uuid()}.${fileExtension}`;
      var ref = Firebase.Instance.storage.ref().child(`${this._profileImageStoragePath}/${fileName}`);

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
            this.setProfileImage(url);

            uploadCompleted && uploadCompleted();
          });
        }
      );
    } catch (error) {
      throw new Error(`Function [${this.uploadProfileImageAsync.name}] ${error}`);
    }
  };

  public DownloadProfileImage = () => {
    Firebase.Instance.downloadImage(this.user.uid)
      .then((data) => {
        console.log("AuthStore DownloadProfileImage success:", data);
        this.setProfileImage(data);
      })
      .catch((error) => {
        console.log("AuthStore DownloadProfileImage error:", error);
        this.setProfileImage("");
      });
  };

  public UploadImage = (uri: string, uploadCompleted?: () => void) => {
    const task = this.uploadImageTask(uri, () => {
      task.next();
      uploadCompleted && uploadCompleted();
    });

    task.next();
  };

  private *uploadImageTask(uri: string, uploadCompleted?: () => void) {
    yield this.uploadProfileImageAsync(uri, uploadCompleted);
    yield Firebase.Instance.updateUserData(this.user.uid, { profile_uri: this.profileImageUri });
  }
}

export default AuthStore;
