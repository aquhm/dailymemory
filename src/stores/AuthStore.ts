import { action, observable, computed } from "mobx";

import Firebase, { QueryOption, CollectionType } from "../utility/Firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import RootStore from "./RootStore";

import ImageApi, { StorageImagePathType } from "../apis//Image/ImageApi";

export interface User {
  name: string;
  email: string;
  profile_uri: string | undefined;
}

class AuthStore {
  private _collectionType: CollectionType;
  private _rootStore: RootStore;

  @observable private _firebaseUser?: firebase.User;
  @observable private _profileImageUri?: string;
  @observable private _user?: User;

  constructor(rootStore: RootStore, collectionType: CollectionType) {
    console.log("AuthStore");

    this._collectionType = collectionType;
    this._rootStore = rootStore;
    this._profileImageUri = "";

    Firebase.Instance.setAuthStateChange(this.onAuthStateChanged);
  }

  public Initialize = () => {};

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

  public get profileImageUri(): string | undefined {
    return this._profileImageUri;
  }

  @action
  private setFirebaseUser(user?: firebase.User) {
    this._firebaseUser = user;
  }

  @action
  private setProfileImage = (profileImage: string | undefined): void => {
    this._profileImageUri = profileImage;
  };

  @action
  private setUser = (user: User): void => {
    this._user = user;
  };

  private onAuthStateChanged = (user: firebase.User): void => {
    if (user != null) {
      console.log("AuthStore onAuthStateChanged login");
      this.setFirebaseUser(user);
      this.getUserAsync();

      this._rootStore.DiaryStore.getListAsync();
    } else {
      console.log("AuthStore onAuthStateChanged logout");
      this.setFirebaseUser(undefined);
    }
  };

  @computed
  get isAuthenticated(): boolean {
    return this._firebaseUser !== null;
  }

  public Login = async (email: string, password: string) => await Firebase.Instance.loginAsync(email, password);

  public SignUp = async (name: string, email: string, password: string) =>
    await Firebase.Instance.signUpAsync(name, email, password);

  public SignOut = async () => await Firebase.Instance.auth.signOut();

  private getUserAsync = async () => {
    try {
      const userDoc = Firebase.Instance.userCollection.doc(this.firebaseUser.uid);
      const userCol = await userDoc.get();

      if (!userCol.exists) {
        console.log(`No such user uid = ${this.firebaseUser.uid}`);
      } else {
        this.setUser(userCol.data() as User);
        this.setProfileImage(this._user?.profile_uri);
      }
    } catch (error) {
      console.error("Error getting document", error);
    }
  };

  public UploadImage = (uri: string, uploadCompleted?: () => void) => {
    const task = this.uploadImageTask(uri, (downloadUrl: string) => {
      if (this._user) {
        this._user.profile_uri = downloadUrl;
      }

      task.next();
      uploadCompleted && uploadCompleted();
    });

    task.next();
  };

  private *uploadImageTask(uri: string, uploadCompleted?: (downloadUrl: string) => void) {
    if (uri != null) {
      yield ImageApi.uploadImageAsync(StorageImagePathType.UserProfile, uri, uploadCompleted);
    }

    yield Firebase.Instance.updateDataByDocumentIdAsync("users", this.firebaseUser.uid, {
      profile_uri: this._user?.profile_uri,
    });
  }
}

export default AuthStore;
