import { action, observable, computed } from "mobx";
import Firebase from "../Firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import RootStore from "./RootStore";
import { v4 as uuid } from "uuid";

export interface User {
  name: string;
  email: string;
  profile_uri: string | null;
}

class AuthStore {
  private readonly _profileImageStoragePath: string = "images/profile";

  @observable private _firebaseUser?: firebase.User;
  @observable private _profileImageUri?: string;
  @observable private _user?: User;

  constructor(private _rootStore: RootStore) {
    console.log("AuthStore");

    Firebase.Instance.setAuthStateChange(this.onAuthStateChanged);
  }

  public Initialize = () => {};

  @action
  private setFirebaseUser(user?: firebase.User) {
    console.log("AuthStore setFirebaseUser " + user);
    this._firebaseUser = user;
  }

  public get user(): User {
    if (!this._user) {
      throw new Error(`${AuthStore.name}  _user is null`);
    }

    return this._user;
  }

  public get firebaseUser(): firebase.User {
    if (!this._firebaseUser) {
      throw new Error(`${AuthStore.name}  firebaseUser is null`);
    }

    return this._firebaseUser;
  }

  public get isLogin(): boolean {
    return this._firebaseUser != null;
  }

  @action
  private setProfileImage = (profileImage: string): void => {
    this._profileImageUri = profileImage;
  };

  @action
  private setUser = (user: User): void => {
    this._user = user;
  };

  private get profileImageUri(): string | undefined {
    return this._profileImageUri;
  }

  private onAuthStateChanged = (user: firebase.User): void => {
    if (user != null) {
      console.log("AuthStore onAuthStateChanged login");
      this.setFirebaseUser(user);

      this.getUserAsync();
    } else {
      console.log("AuthStore onAuthStateChanged logout");
      this.setFirebaseUser(undefined);
    }
  };

  @computed
  get isAuthenticated(): boolean {
    return this._firebaseUser !== null ? true : false;
  }

  public Login = async (email: string, password: string) => await Firebase.Instance.login(email, password);

  public SignUp = async (name: string, email: string, password: string) =>
    await Firebase.Instance.signUp(name, email, password);

  public SignOut = async () => await Firebase.Instance.auth.signOut();

  private uploadProfileImageAsync = async (imageUri: string, uploadCompleted?: () => void) => {
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

  private getUserAsync = async () => {
    try {
      const userDoc = Firebase.Instance.userCollection.doc(this.firebaseUser.uid);
      const userCol = await userDoc.get();

      if (!userCol.exists) {
        console.log(`No such user uid = ${this.firebaseUser.uid}`);
      } else {
        this.setUser(userCol.data() as User);
      }
    } catch (error) {
      console.error("Error getting document", error);
    }
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
    yield Firebase.Instance.updateUserData(this.firebaseUser.uid, { profile_uri: this.profileImageUri });
  }
}

export default AuthStore;
