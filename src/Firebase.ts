import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

import ApiKeys from "./constants/ApiKeys";

class Firebase {
  //private firebase.auth.AuthProvider _googleProvider;

  private _app?: firebase.app.App;
  private _auth?: firebase.auth.Auth;
  private _db?: firebase.firestore.Firestore;
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
    console.log("Firebase app length = ", firebase.apps.length);

    try {
      if (firebase.apps.length == 0) {
        this._app = firebase.initializeApp(ApiKeys.FirebaseConfig);
      }
    } catch (err) {
      // we skip the "already exists" message which is
      // not an actual error when we're hot-reloading
      console.error("Firebase initialization error : ", err.stack);
    }

    this._auth = firebase.auth();
    this._db = firebase.firestore();
    //this._googleProvider = new firebase.auth.GoogleAuthProvider()
    //this._facebookProvider = new firebase.auth.FacebookAuthProvider()

    console.log("Firebase Initialized");
  };

  get db() {
    if (!this.db) {
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

  public signInAnonymously = () => {
    this._auth?.signInAnonymously().catch((error: any) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  };

  /*
  public updateUserData(userID: string, data: any) {
    // Add each property individually so we don't overwrite any data...

    console.log("updateUserData. userID  = " + userID + " data = " + data)
    var paths = {}
    Object.keys(data).forEach((dataKey) => {
      paths["users/" + userID + "/" + dataKey] = data[dataKey]
    })

    console.log("updateUserData. paths  = " + paths)
    // Perform the update...
    return firebase.database().ref().update(paths)
  }
*/
  public setAuthStateChange(callback: any) {
    return this._auth?.onAuthStateChanged(callback);
  }

  public SighUp = async (
    name: string,
    email: string,
    password: string,
    onAuthStateChange: any,
    rememberSession: boolean = true,
    emailVerification: boolean = false
  ) => {
    try {
      this.setAuthStateChange(onAuthStateChange);

      const userCredential = await this._auth?.createUserWithEmailAndPassword(email, password);

      if (userCredential !== undefined) {
        const userCollection = this.db.collection("users");
        const userDoc = userCollection.doc(userCredential.user?.uid);

        await userDoc?.set(
          {
            name: name,
            email: email,
          },
          { merge: true }
        );
      }

      if (emailVerification) {
        await this.user.sendEmailVerification();
      }
    } catch (error) {
      console.log(`Function [SighUp] ${error}`);
    }
  };

  public Login = async (email: string, password: string, onAuthStateChange: any, rememberSession: boolean = false) => {
    let ret = false;
    try {
      const _rememberSession: string = rememberSession
        ? firebase.auth.Auth.Persistence.LOCAL
        : firebase.auth.Auth.Persistence.SESSION;

      this.setAuthStateChange(onAuthStateChange);
      await this._auth?.setPersistence(_rememberSession);

      ret = (await this._auth?.signInWithEmailAndPassword(email, password)) != null;
      // return (await this._auth?.signInWithEmailAndPassword(email, password)) != null;

      // ret = true;
    } catch (error) {
      console.log(`Function [Login] ${error}`);
    }

    return ret;
  };

  /*
  signInWithGoogle = () => this._auth?.signInWithPopup(this._googleProvider)

  signInWithFacebook = () => this._auth?.signInWithPopup(this._facebookProvider)

  signInWithTwitter = () => this._auth?.signInWithPopup(this._twitterProvider)

  signInWithGithub = () => this._auth?.signInWithPopup(this._githubProvider)
*/
  public signOut = () => this._auth?.signOut();

  public sendEmailVerification = () => {
    console.log("sendEmailVerification = " + this._auth?.currentUser);
    //return this._auth?.currentUser?.sendEmailVerification({
    //  url: ApiKeys.FirebaseConfig.messagingSenderId,
    return this.User?.sendEmailVerification();
  };

  public get User() {
    if (!this._auth?.currentUser) {
      throw new Error("this._auth.currentUser is null");
    }

    return this._auth?.currentUser;
  }

  public passwordUpdate = (password: string) => {
    this.User?.updatePassword(password);
  };

  /*
  on = callback =>
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)))

  parse = snapshot => {}

  off() {
    this.ref.off()
  }
  */
}

//let _firebase = new Firebase()

export default Firebase;
