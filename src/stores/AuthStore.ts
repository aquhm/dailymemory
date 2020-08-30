import { action, observable, computed } from "mobx";
import Firebase from "../Firebase";
import RootStore from "./RootStore";

class AuthStore {
  @observable private _user?: firebase.User;

  constructor(private _rootStore: RootStore) {
    console.log("AuthStore");

    Firebase.Instance.setAuthStateChange(this.onAuthStateChanged);
  }

  @action
  private SetUser(user: firebase.User) {
    console.log("AuthStore SetUser " + user);
    this._user = user;
  }

  public GetUser(): firebase.User {
    if (!this._user) {
      throw new Error(`${AuthStore.name}  user is null`);
    }

    return this._user;
  }

  private onAuthStateChanged = (user: firebase.User): void => {
     if (user != null) {
      this.SetUser(user);
    }
  };

  @computed
  get isAuthenticated(): boolean {
    return this._user !== null ? true : false;
  }

  public Login = async (email: string, password: string) => await Firebase.Instance.login(email, password);

  public SignUp = async (name: string, email: string, password: string) =>
    await Firebase.Instance.signUp(name, email, password);

  public signOut = () => Firebase.Instance.auth.signOut();
}

export default AuthStore;
