import AuthStore from "./AuthStore";
import DiaryStore from "./DiaryStore";

class RootStore {
  static _rootStore?: RootStore;
  public _authStore: AuthStore;
  public _diaryStore: DiaryStore;

  static get Instance() {
    if (!this._rootStore) {
      this._rootStore = new RootStore();
      return this._rootStore;
    } else {
      return this._rootStore;
    }
  }

  private constructor() {
    this._authStore = new AuthStore(this);
    this._diaryStore = new DiaryStore(this);

    console.log("Initialize RootStore");
  }

  public get AuthStore() {
    return this._authStore;
  }

  public get DiaryStore() {
    return this._diaryStore;
  }

  public Initialize = () => {
    this._authStore.Initialize();
    this._diaryStore.Initialize();
  };
}

export default RootStore;
