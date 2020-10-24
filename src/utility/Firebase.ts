import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

import ApiKeys from "../constants/ApiKeys";
import FirebaseCollectionCenter, { QueryOption, CollectionType } from "./FirebaseCollectionCenter";
import FirebaseLoginCenter from "./FirebaseLoginCenter";

class Firebase {
  static _firebase?: Firebase;

  private _app?: firebase.app.App;
  private _auth?: firebase.auth.Auth;
  private _db?: firebase.firestore.Firestore;
  private _storage?: firebase.storage.Storage;

  private _collectionCenter!: FirebaseCollectionCenter;
  private _loginCenter!: FirebaseLoginCenter;

  static get Instance() {
    if (!this._firebase) {
      this._firebase = new Firebase();
      return this._firebase;
    } else {
      return this._firebase;
    }
  }

  private constructor() {
    this.init();
  }

  init = () => {
    try {
      if (firebase.apps.length == 0) {
        this._app = firebase.initializeApp(ApiKeys.FirebaseConfig);
      }
    } catch (err) {
      console.error("Firebase initialization error : ", err.stack);
    }

    this._auth = firebase.auth();
    this._db = firebase.firestore();
    this._storage = firebase.storage();

    this._collectionCenter = new FirebaseCollectionCenter(this._db);
    this._loginCenter = new FirebaseLoginCenter(this._auth);

    console.log("Firebase Initialized");
  };

  get storage() {
    if (!this._storage) {
      throw new Error("storage is null");
    }

    return <firebase.storage.Storage>this._storage;
  }

  get CollectionCenter() {
    return this._collectionCenter;
  }

  get LollectionCenter() {
    return this._loginCenter;
  }

  get Auth() {
    if (!this._auth) {
      throw new Error("auth is null");
    }

    return this._auth;
  }

  get User() {
    if (!this.Auth.currentUser) {
      throw new Error("auth.currentUser is null");
    }

    return this.Auth.currentUser;
  }

  public signInAnonymouslyAsync = async () => {
    try {
      await this.Auth.signInAnonymously();
    } catch (error) {
      throw new Error(`Function [${this.signInAnonymouslyAsync.name}] ${error}`);
    }
  };

  public setAuthStateChange(callback: any) {
    return this.Auth.onAuthStateChanged(callback);
  }

  public signUpAsync = async (name: string, email: string, password: string, rememberSession: boolean = true, emailVerification: boolean = false) => {
    try {
      const userCredential = await this.Auth.createUserWithEmailAndPassword(email, password);

      if (userCredential != null) {
        if (userCredential.user != null) {
          await this.CollectionCenter.writeDataByDocumentIdAsync("users", userCredential.user.uid, {
            name: name,
            email: email,
          });

          if (emailVerification) {
            this.User.sendEmailVerification();
          }

          return true;
        } else {
        }
      } else {
      }
    } catch (error) {
      throw new Error(`Function [${this.signUpAsync.name}] ${error}`);
    }

    return false;
  };

  public loginAsync = async (email: string, password: string, rememberSession: boolean = false) => {
    let ret = false;
    try {
      ret = (await this.Auth.signInWithEmailAndPassword(email, password)) != null;
    } catch (error) {
      throw new Error(`Function [${this.loginAsync.name}] ${error}`);
    }

    return ret;
  };

  public signOut = () => this.Auth.signOut();

  public sendEmailVerification = () => {
    try {
      this.User.sendEmailVerification();
    } catch (error) {
      throw new Error(error);
    }
  };

  public passwordUpdate = (password: string) => {
    try {
      this.User.updatePassword(password);
    } catch (error) {
      throw new Error(error);
    }
  };
}

export { QueryOption, CollectionType };
export default Firebase;
