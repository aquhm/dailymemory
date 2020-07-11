import { action, observable } from "mobx"
import { isNull, isString } from "lodash"
import Firebase from "../Firebase"

class AuthStore {
  @observable _user = null
  @observable Authentivation = false

  @observable _userInfo = {
    id: -1,
    username: "",
    email: "",
  }

  constructor(root) {
    this.rootStore = root

    console.log("AuthStore")
    Firebase.setAuthStateChange(this.onAuthStateChanged)
    //Firebase.auth.onAuthStateChanged(this.onAuthStateChanged)
    //this.observeAuth()
  }

  //observeAuth = () => {
  //  Fire.auth.onAuthStateChanged(this.onAuthStateChanged)
  //}

  setAuthentivation = (authentivation) => {
    console.log("setAuthentivation " + authentivation)
    this.Authentivation = authentivation
  }

  setUser = (user) => {
    this._user = user
  }

  @action
  onAuthStateChanged = (user) => {
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
  signIn = ({ email, password }) => {
    if (this._user) {
      return Promise.resolve(this._user)
    }

    const userCredential = Fire.auth.signInWithEmailAndPassword(email, password)

    return userCredential
  }

  @action
  signUp = ({ email, password }) => {
    console.log("AuthStore signUp")

    return Fire.auth.createUserWithEmailAndPassword(email, password)
  }

  @action
  signUpWithName = ({ email, password, name }) => {
    console.log("AuthStore signUpWithName")

    var signUp = signUp(email, password).then((userCredential) => {
      userCredential.user.updateProfile({
        displayName: name,
      })
    })

    return signUp
  }

  @action
  signOut = () => {
    return Fire.auth.signOut()
  }

  @action
  forgotPassword = ({ email }) => {
    return Fire.auth.sendPasswordResetEmail(email)
  }
}

export default AuthStore
