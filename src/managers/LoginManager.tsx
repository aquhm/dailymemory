import GoogleLoginBehaviour from "../behaviour/login/GoogleLoginBehaviour"
import FacebookLoginBehaviour from "../behaviour/login/FacebookLoginBehaviour"

class LoginManager {
  private _googleLoginBehaviour: GoogleLoginBehaviour
  private _faceBookLoginBehaviour: FacebookLoginBehaviour

  static _instance?: LoginManager

  public static get Instance() {
    if (!this._instance) {
      this._instance = new LoginManager()
      return this._instance
    } else {
      return this._instance
    }
  }
  private constructor() {
    this._googleLoginBehaviour = new GoogleLoginBehaviour()
    this._faceBookLoginBehaviour = new FacebookLoginBehaviour()
  }
}

export default LoginManager
