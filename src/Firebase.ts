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
          console.log("signUp writeUserDate serCredential.user.uid = " + userCredential.user.uid);
          await this.writeUserDate(userCredential.user.uid, {
            name: name,
            email: email,
          });
        }

        console.log("signUp writeUserDate ");
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

  public async writeUserDate(userId: string, userData: any) {
    console.log("writeUserDate  this.userCollection = " + this.userCollection);

    const userDoc = this.userCollection.doc(userId);

    console.log("writeUserDate userDoc = " + userDoc);
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
