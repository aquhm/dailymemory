import { action, observable, computed } from "mobx";
import Firebase from "../Firebase";
import RootStore from "./RootStore";

class AuthStore {
  @observable private _user?: firebase.User;
  @observable private _profileImage?: string;

  constructor(private _rootStore: RootStore) {
    console.log("AuthStore");

    Firebase.Instance.setAuthStateChange(this.onAuthStateChanged);
  }

  @action
  private setUser(user: firebase.User) {
    console.log("AuthStore SetUser " + user);
    this._user = user;
  }

  public get user(): firebase.User {
    if (!this._user) {
      throw new Error(`${AuthStore.name}  user is null`);
    }

    return this._user;
  }

  @action
  private setProfileImage = (profileImage: string): void => {
    this._profileImage = profileImage;
  };

  private onAuthStateChanged = (user: firebase.User): void => {
    if (user != null) {
      console.log("AuthStore onAuthStateChanged login");
      this.setUser(user);
      //this.DownloadProfileImage();
    } else {
      console.log("AuthStore onAuthStateChanged logout");
    }
  };

  @computed
  get isAuthenticated(): boolean {
    return this._user !== null ? true : false;
  }

  public Login = async (email: string, password: string) => await Firebase.Instance.login(email, password);

  public SignUp = async (name: string, email: string, password: string) =>
    await Firebase.Instance.signUp(name, email, password);

  public SignOut = async () => await Firebase.Instance.auth.signOut();

  public UploadImage = async (uri: string, uploadCompleted?: () => void) => {
    const downloadUri = await Firebase.Instance.uploadImage(this.user.uid, uri, uploadCompleted);
    await Firebase.Instance.writeUserData(this.user.uid, {
      profile_uri: downloadUri,
    });
  };

  public DownloadProfileImage = () => {
    Firebase.Instance.downloadImage(this.user.uid)
      .then((data) => {
        console.log("AuthStore DownloadProfileImage success:", data);
        this.setProfileImage(data);
      })
      .catch((error) => {
        console.log("AuthStore DownloadProfileImage error:", error);
        this.setProfileImage("");
      });
  };

  public UploadImage1 = (uri: string, uploadCompleted?: () => void) => {
    const task = this.uploadImageTask(uri, () => {
      task.next();
      uploadCompleted && uploadCompleted();
    });

    console.log("=========== UploadImage1 task = " + task);
    task.next();
  };

  *uploadImageTask(uri: string, uploadCompleted?: () => void) {
    console.log("=========== uploadImageTask yield 0");
    const downloadUri = yield Firebase.Instance.uploadImage(this.user.uid, uri, uploadCompleted);
    console.log("=========== uploadImageTask yield 1");
    yield Firebase.Instance.writeUserData(this.user.uid, { profile_uri: downloadUri });
    console.log("=========== uploadImageTask yield 2");
  }
}

export default AuthStore;
