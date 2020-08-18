import AuthStore from "./AuthStore";

class RootStore {
  static _rootStore?: RootStore;
  private readonly _authStore: AuthStore;

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

    console.log("Initialize RootStore");
  }

  public get AuthStore() {
    return this._authStore;
  }
}

export default RootStore;
