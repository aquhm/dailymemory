import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

class FirebaseLoginCenter {
  private readonly _auth: firebase.auth.Auth;

  constructor(auth: firebase.auth.Auth) {
    this._auth = auth;
  }
}

/*
  signInWithGoogle = () => this._auth?.signInWithPopup(this._googleProvider)

  signInWithFacebook = () => this._auth?.signInWithPopup(this._facebookProvider)

  signInWithTwitter = () => this._auth?.signInWithPopup(this._twitterProvider)

  signInWithGithub = () => this._auth?.signInWithPopup(this._githubProvider)
*/

export default FirebaseLoginCenter;
