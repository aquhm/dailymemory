import { action, observable } from "mobx"
import { isNull, isString } from "lodash"
import Firebase from "../Firebase"
import RootStore from "./RootStore"

class AuthStore {
  @observable private _user?: firebase.User
  @observable private _authentivation: boolean = false

  constructor(private _rootStore: RootStore) {
    console.log("AuthStore")
    Firebase.Instance.setAuthStateChange(this.onAuthStateChanged)
    //Firebase.auth.onAuthStateChanged(this.onAuthStateChanged)
    //this.observeAuth()
  }

  //observeAuth = () => {
  //  Fire.auth.onAuthStateChanged(this.onAuthStateChanged)
  //}

  setAuthentivation = (authentivation: boolean) => {
    console.log("setAuthentivation " + authentivation)
    this._authentivation = authentivation
  }

  setUser = (user: firebase.User) => {
    this._user = user
  }

  @action
  onAuthStateChanged = (user: firebase.User) => {
    if (!user) {
      try {
        console.log("onAuthStateChanged user is null")
      } catch ({ message }) {
        alert(message)
      }
    } else {
      console.log("onAuthStateChanged user = " + JSON.stringify(user))
      this.setUser(user)
      this.setAuthentivation(true)
    }
  }

  @action
  signIn = (email: string, password: string) => {
    if (this._user) {
      return Promise.resolve(this._user)
    }
    const userCredential = Firebase.Instance.Login(email, password)

    return userCredential
  }

  @action
  signUp = (email: string, password: string) => {
    console.log("AuthStore signUp")

    return Firebase.Instance.auth?.createUserWithEmailAndPassword(
      email,
      password
    )
  }

  @action
  signUpWithName = (email: string, password: string, name: string) => {
    console.log("AuthStore signUpWithName")

    var signup = this.signUp(email, password)?.then(
      (userCredential: firebase.auth.UserCredential) => {
        userCredential.user?.updateProfile({
          displayName: name,
        })
      }
    )

    return signup
  }

  @action
  signOut = () => {
    return Firebase.Instance.auth?.signOut()
  }

  @action
  public forgotPassword = (email: string) => {
    return Firebase.Instance.auth?.sendPasswordResetEmail(email)
  }
}

export default AuthStore
