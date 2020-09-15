import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import { v4 as uuid } from "uuid";

import ApiKeys from "./constants/ApiKeys";

class Firebase {
  //private firebase.auth.AuthProvider _googleProvider;

  private _app?: firebase.app.App;
  private _auth?: firebase.auth.Auth;
  private _db?: firebase.firestore.Firestore;
  private _storage?: firebase.storage.Storage;
  static _firebase?: Firebase;

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
    //this._googleProvider = new firebase.auth.GoogleAuthProvider()
    //this._facebookProvider = new firebase.auth.FacebookAuthProvider()

    console.log("Firebase Initialized");
  };

  get storage() {
    if (!this._storage) {
      throw new Error("storage is null");
    }

    return <firebase.storage.Storage>this._storage;
  }

  get db() {
    if (!this._db) {
      throw new Error("db is null");
    }

    return <firebase.firestore.Firestore>this._db;
  }

  get auth() {
    if (!this._auth) {
      throw new Error("auth is null");
    }

    return this._auth;
  }

  get user() {
    if (!this.auth.currentUser) {
      throw new Error("auth.currentUser is null");
    }

    return this.auth.currentUser;
  }

  get userCollection() {
    return this.db.collection("users");
  }

  public signInAnonymously = async () => {
    try {
      await this.auth.signInAnonymously();
    } catch (error) {
      throw new Error(`Function [${this.signInAnonymously.name}] ${error}`);
    }
  };

  public uploadImage = async (userId: string, imageUri: string, uploadCompleted?: () => void) => {
    try {
      const fileExtension = imageUri.split(".").pop();
      console.log("Ext : " + fileExtension);

      const fileName = `${uuid()}.${fileExtension}`;

      const response = await fetch(imageUri);
      const blob = await response.blob();
      let downloadUri: string = "";

      var ref = this.storage.ref().child(`images/profile/${fileName}`);

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
            console.log("File available at : " + url);

            downloadUri = url;
            uploadCompleted && uploadCompleted();
          });
        }
      );

      return Promise.resolve(downloadUri);
    } catch (error) {
      throw new Error(`Function [${this.uploadImage.name}] ${error}`);
    }
  };

  public downloadImage = async (userId: string) => {
    try {
      console.error("Firebase downloadImage Images/" + userId);

      let imageRef = this.storage.ref("Images/" + userId);

      return imageRef.getDownloadURL();
    } catch (error) {
      throw new Error(`Function [${this.downloadImage.name}] ${error}`);
    }
  };

  public setAuthStateChange(callback: any) {
    return this.auth.onAuthStateChanged(callback);
  }

  public signUp = async (
    name: string,
    email: string,
    password: string,
    rememberSession: boolean = true,
    emailVerification: boolean = false
  ) => {
    try {
      const userCredential = await this._auth?.createUserWithEmailAndPassword(email, password);

      if (userCredential != null) {
        if (userCredential.user != null) {
          await this.writeUserData(userCredential.user.uid, {
            name: name,
            email: email,
          });
        }
        if (emailVerification) {
          this.user.sendEmailVerification();
        }

        return true;
      }
    } catch (error) {
      throw new Error(`Function [${this.signUp.name}] ${error}`);
    }

    return false;
  };

  public async writeUserData(userId: string, userData: any) {
    const userDoc = this.userCollection.doc(userId);

    await userDoc?.set(userData, { merge: true });
  }

  public async getUserData(userId: string) {
    try {
      const user = await this.userCollection.doc(userId).get();
      if (user.exists) {
        return user.data();
      }
    } catch (error) {
      throw new Error(`Function [${this.getUserData.name}] ${error}`);
    }
  }

  public login = async (email: string, password: string, rememberSession: boolean = false) => {
    let ret = false;
    try {
      /*
      const _rememberSession: string = rememberSession
        ? firebase.auth.Auth.Persistence.LOCAL
        : firebase.auth.Auth.Persistence.SESSION;
        

      await this._auth?.setPersistence(_rememberSession);
      */

      ret = (await this._auth?.signInWithEmailAndPassword(email, password)) != null;
    } catch (error) {
      throw new Error(`Function [${this.login.name}] ${error}`);
    }

    return ret;
  };

  /*
  signInWithGoogle = () => this._auth?.signInWithPopup(this._googleProvider)

  signInWithFacebook = () => this._auth?.signInWithPopup(this._facebookProvider)

  signInWithTwitter = () => this._auth?.signInWithPopup(this._twitterProvider)

  signInWithGithub = () => this._auth?.signInWithPopup(this._githubProvider)
*/
  public signOut = () => this.auth.signOut();
  public sendEmailVerification = () => {
    try {
      this.user.sendEmailVerification();
    } catch (error) {
      throw new Error(error);
    }
  };

  public passwordUpdate = (password: string) => {
    try {
      this.user.updatePassword(password);
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default Firebase;
