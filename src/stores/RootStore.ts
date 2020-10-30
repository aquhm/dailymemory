import AuthStore from "./AuthStore";
import DiaryStore from "./DiaryStore";
import DiaryPageStore from "./DiaryPageStore";
import DiaryLobbyStore from "./DiaryLobbyStore";
import UserStore from "./UserStore";

import { configure } from "mobx";

class RootStore {
  static _rootStore?: RootStore;
  private _authStore: AuthStore;
  private _userStore: UserStore;
  private _diaryStore: DiaryStore;
  private _diaryPageRecords: DiaryPageStore;
  private _diaryLobbytore: DiaryLobbyStore;

  static get Instance() {
    if (!this._rootStore) {
      this._rootStore = new RootStore();
      return this._rootStore;
    } else {
      return this._rootStore;
    }
  }

  private constructor() {
    configure({ enforceActions: "observed" });

    this._authStore = new AuthStore(this, "users");
    this._userStore = new UserStore(this, "users");
    this._diaryStore = new DiaryStore(this, "diaries");
    this._diaryPageRecords = new DiaryPageStore(this, "diary_records");
    this._diaryLobbytore = new DiaryLobbyStore(this, "diaries");

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

  public get DiaryLobbyStore() {
    return this._diaryLobbytore;
  }

  public get UserStore() {
    return this._userStore;
  }

  public Initialize = () => {
    this._authStore.Initialize();
    this._userStore.Initialize();
    this._diaryStore.Initialize();
    this._diaryPageRecords.Initialize();
    this._diaryLobbytore.Initialize();
  };

  public PreInitialize = () => {
    this._authStore.Initialize();
  };

  public PostInitialize = () => {
    this._userStore.Initialize();
    this._diaryStore.Initialize();
    this._diaryPageRecords.Initialize();
    this._diaryLobbytore.Initialize();
  };
}

export default RootStore;
