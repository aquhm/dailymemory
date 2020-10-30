import { action, observable, computed, runInAction } from "mobx";

import Firebase from "../utility/Firebase";
import { CollectionType } from "../utility/FirebaseCollectionCenter";

import RootStore from "./RootStore";
import * as _ from "lodash";

import { DiaryRecord } from "../shared/records";
import { Diary } from "./object";
import My from "../utility/My";

class DiaryLobbyStore {
  private _collectionType: CollectionType;
  private _rootStore: RootStore;
  private _unsubscribe?: any;

  @observable
  private _diaries: Array<Diary> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(DiaryLobbyStore.name);

    this._collectionType = collectionType;
    this._rootStore = rootStore;
  }

  public Initialize = () => {
    this.setListner();
  };

  @computed
  public get Values(): Array<Diary> {
    return this._diaries;
  }

  @computed
  public get Count(): number {
    return this._diaries.length;
  }

  @action
  private clear = () => {
    while (this._diaries.length > 0) {
      this._diaries.pop();
    }

    this._unsubscribe && this._unsubscribe();
  };

  @action
  public getListAsync = async () => {
    const snapshot = await Firebase.Instance.CollectionCenter.getDatasAsync(this._collectionType);

    if (snapshot && snapshot.empty == false) {
      runInAction(() => {
        snapshot.forEach((doc) => this.upsert(doc));
      });
    }
  };

  @action
  private upsertByLisner = (updateDocumentDatas: firebase.firestore.DocumentChange<firebase.firestore.DocumentData>[]) => {
    updateDocumentDatas.forEach((change) => {
      if (change.type === "added") {
        console.log(`${DiaryLobbyStore.name} diary added !!`);
      }
      if (change.type === "modified") {
        console.log(`${DiaryLobbyStore.name} Modified !! `);

        this.update(change.doc);
      }
      if (change.type === "removed") {
        console.log(`${DiaryLobbyStore.name} Remove Data: `, change.doc.data());

        this.remove(change.doc.data() as DiaryRecord);
      }
    });
  };

  private setListner = () => {
    if (My.IsLogin) {
      this._unsubscribe = Firebase.Instance.CollectionCenter.Diary.onSnapshot((querySnapshot) => {
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

  private update(documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): boolean {
    const diary = this._diaries.find((t) => {
      return t.Record.documentId === documentData.id;
    });

    if (diary != null) {
      diary.Record = documentData.data() as DiaryRecord;

      return true;
    } else {
      return false;
    }
  }

  private add = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): void => {
    const newRecord = documentData.data() as DiaryRecord;
    newRecord.documentId = documentData.id;

    const newDiary = new Diary(newRecord, this.collectionType);

    this._diaries.push(newDiary);
  };

  private remove = (removeRecord: DiaryRecord): void => {
    const index = this._diaries.findIndex((t) => {
      return t.Record.documentId === removeRecord.documentId;
    });

    if (index != -1) {
      this._diaries.splice(index, 1);
    }
  };

  public findByUserId = (userId: string): Diary | undefined => {
    return this._diaries.find((t) => t.Record.userId == userId);
  };

  public findByDocumentId = (documentId: string): Diary | undefined => {
    return this._diaries.find((t) => t.Record.documentId == documentId);
  };
}

export default DiaryLobbyStore;
