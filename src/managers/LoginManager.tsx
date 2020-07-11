import GoogleLoginBehaviour from "../behaviour/login/GoogleLoginBehaviour"
import FacebookLoginBehaviour from "../behaviour/login/FacebookLoginBehaviour"
import LoginScreen from "../screens/LoginScreen"

class LoginManager {
  constructor() {
    this._googleLoginBehaviour = new GoogleLoginBehaviour()
    this._faceBookLoginBehaviour = new FacebookLoginBehaviour()

    initialize()
  }

  initialize = () => {}
}

const LoginManager = new LoginScreen()

export default LoginManager
