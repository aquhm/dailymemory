import { action, observable, computed, runInAction } from "mobx";

import * as firebase from "firebase/app";
import Firebase, { CollectionType } from "../utility/Firebase";

import RootStore from "./RootStore";
import * as _ from "lodash";

import { UserRecord } from "../shared/records";
import My from "../utility/My";

import { User } from "./object";

class UserStore {
  private _rootStore: RootStore;
  private _collectionType: CollectionType;
  private _unsubscribe?: any;

  @observable
  private _users: Array<User> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(UserStore.name);

    this._collectionType = collectionType;
    this._rootStore = rootStore;
  }

  public Initialize = () => {
    this.setListner();
  };

  @computed
  public get Values(): Array<User> {
    return this._users;
  }

  @computed
  get Count(): number {
    return this._users.length;
  }

  @action
  private clear = () => {
    while (this._users.length > 0) {
      this._users.pop();
    }

    this._unsubscribe && this._unsubscribe();
  };

  @action
  private upsertByLisner = (updates: firebase.firestore.DocumentChange<firebase.firestore.DocumentData>[]) => {
    updates.forEach((change) => {
      if (change.type === "added") {
        console.log(`${UserStore.name} userRecord added !!`);

        this.add(change.doc);
      }
      if (change.type === "modified") {
        console.log(`${UserStore.name} userRecord modified !! `);

        this.update(change.doc);
      }
      if (change.type === "removed") {
        console.log(`${UserStore.name} userRecord removed !! `);

        this.remove(change.doc);
      }
    });
  };

  @action
  public getListAsync = async () => {
    const snapshot = await Firebase.Instance.CollectionCenter.getDatasAsync(this._collectionType);

    if (snapshot != null && snapshot.empty == false) {
      runInAction(() => {
        snapshot.forEach((doc) => this.upsert(doc));
      });
    }
  };

  private setListner = () => {
    if (My.IsLogin) {
      this._unsubscribe = Firebase.Instance.CollectionCenter.User.onSnapshot((querySnapshot) => {
        this.upsertByLisner(querySnapshot.docChanges());
      });
    } else {
      // 동작 없음.
    }
  };
  private upsert = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>) => {
    if (this.update(documentData) == false) {
      this.add(documentData);
    }
  };

  @action
  private update(documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): boolean {
    const user = this._users.find((t) => {
      return t.Record.documentId === documentData.id;
    });

    if (user != null) {
      user.Record = documentData.data() as UserRecord;
      user.Record.documentId = documentData.id;

      return true;
    } else {
      return false;
    }
  }

  @action
  private add = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): void => {
    const newRecord = documentData.data() as UserRecord;
    newRecord.documentId = documentData.id;

    const newUser = new User(newRecord, this.collectionType);

    this._users.push(newUser);
  };

  private remove = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): void => {
    const index = this._users.findIndex((t) => {
      return t.Record.documentId === documentData.id;
    });

    if (index != -1) {
      this._users.splice(index, 1);
    }
  };

  public findByDocumentId = (documentId: string): User | undefined => {
    return this._users.find((t) => t.Record.documentId == documentId);
  };
}

export default UserStore;
