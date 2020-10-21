import AuthStore from "./AuthStore";
import DiaryStore from "./DiaryStore";
import DiaryPageStore from "./DiaryPageStore";

class RootStore {
  static _rootStore?: RootStore;
  public _authStore: AuthStore;
  public _diaryStore: DiaryStore;
  public _diaryPageRecords: DiaryPageStore;

  static get Instance() {
    if (!this._rootStore) {
      this._rootStore = new RootStore();
      return this._rootStore;
    } else {
      return this._rootStore;
    }
  }

  private constructor() {
    this._authStore = new AuthStore(this, "users");
    this._diaryStore = new DiaryStore(this, "diaries");
    this._diaryPageRecords = new DiaryPageStore(this, "diary_records");

    console.log("Initialize RootStore");
  }

  public get AuthStore() {
    return this._authStore;
  }

  public get DiaryStore() {
    return this._diaryStore;
  }

  public get DiaryPageStore() {
    return this._diaryPageRecords;
  }

  public Initialize = () => {
    this._authStore.Initialize();
    this._diaryStore.Initialize();
    this._diaryPageRecords.Initialize();
  };
}

export default RootStore;
