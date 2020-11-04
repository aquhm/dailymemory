import { action, observable, computed } from "mobx";

import Firebase, { QueryOption, CollectionType } from "../utility/Firebase/Firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import RootStore from "./RootStore";

import ImageApi, { StorageImagePathType } from "../apis//Image/ImageApi";
import _ from "lodash";
import My from "../utility/My";
import { User } from "./object";
import { UserRecord } from "../shared/records";

/*
export interface User {
  name: string;
  email: string;
  profile_uri: string | undefined;
}
*/
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

  @computed
  public get User(): User {
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
  private setUser = (user: UserRecord): void => {
    this._user = new User(user, "users");
  };

  private onAuthStateChanged = (user: firebase.User): void => {
    if (user != null) {
      console.log("AuthStore onAuthStateChanged login");
      this.setFirebaseUser(user);
      RootStore.Instance.PostInitialize();
      this.loginTaskAsync(user);

      My.LatestDiariesAsync();
    } else {
      console.log("AuthStore onAuthStateChanged logout");
      this.setFirebaseUser(undefined);
    }
  };

  @computed
  get isAuthenticated(): boolean {
    return this._firebaseUser !== null && _.isEmpty(this.firebaseUser.uid) == false;
  }

  public Login = async (email: string, password: string) => await Firebase.Instance.loginAsync(email, password);

  public SignUp = async (name: string, email: string, password: string) => await Firebase.Instance.signUpAsync(name, email, password);

  public SignOut = async () => await Firebase.Instance.Auth.signOut();

  private loginTaskAsync = async (user: firebase.User) => {
    await this.updateLastLoginTime();
    await this.getUserAsync();
  };

  private updateLastLoginTime = async () => {
    if (this.isLogin == true) {
      await Firebase.Instance.CollectionCenter.writeDataByDocumentIdAsync(this._collectionType, this.firebaseUser.uid, {
        lastLoginTime: new Date(),
      });
    }
  };

  private getUserAsync = async () => {
    try {
      const userDocRef = Firebase.Instance.CollectionCenter.getDocument(this._collectionType, this.firebaseUser.uid);
      const userDocData = await userDocRef.get();

      if (!userDocData.exists) {
        console.log(`No such user uid = ${this.firebaseUser.uid}`);
      } else {
        const userRecord = userDocData.data() as UserRecord;
        userRecord.documentId = this.firebaseUser.uid;

        this.setUser(userRecord);
      }
    } catch (error) {
      console.error("Error getting document", error);
    }
  };

  public UploadImage = (uri: string, uploadCompleted?: () => void) => {
    const task = this.uploadImageTask(uri, (downloadUrl: string) => {
      if (this._user) {
        this._user.Record.profile_uri = downloadUrl;
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

    yield Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, this.firebaseUser.uid, {
      profile_uri: this._user?.Record.profile_uri,
    });
  }
}

export default AuthStore;
