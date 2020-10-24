import { action, observable, computed } from "mobx";

import Firebase from "../utility/Firebase";
import { QueryOption, CollectionType } from "../utility/FirebaseCollectionCenter";

import RootStore from "./RootStore";
import * as _ from "lodash";

import { DiaryRecord } from "../shared/records";

class DiaryLobbyStore {
  private _collectionType: CollectionType;
  private _currentDiaryId?: string;
  private _rootStore: RootStore;

  @observable private _diaryRecords: Array<DiaryRecord> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(DiaryLobbyStore.name);

    this._collectionType = collectionType;
    this._rootStore = rootStore;
  }

  public Initialize = () => {};

  public get values(): Array<DiaryRecord> {
    return this._diaryRecords;
  }

  public get currentDiaryId(): string | undefined {
    if (this._currentDiaryId == null) {
      if (this.values.length == 1) this._currentDiaryId = this.values[0].documentId;
    }

    return this._currentDiaryId;
  }

  public set currentDiaryId(id: string | undefined) {
    this._currentDiaryId = id;
  }

  @action
  private update(documentId: string, updatedRecord: DiaryRecord): boolean {
    const index = this._diaryRecords.findIndex((t) => {
      return t.documentId === documentId;
    });

    if (index != -1) {
      updatedRecord.documentId = documentId;
      this._diaryRecords.splice(index, 1, updatedRecord);

      return true;
    } else {
      return false;
    }
  }

  @action
  private add = (documentId: string, newRecord: DiaryRecord): void => {
    if (documentId) {
      newRecord.documentId = documentId;
      this._diaryRecords.push(newRecord);
    } else {
      console.log("add : !! error" + documentId);
    }
  };

  @action
  private remove = (documentId: string, diary: DiaryRecord): void => {
    const index = this._diaryRecords.findIndex((t) => {
      return t.documentId === documentId;
    });

    if (index != -1) {
      this._diaryRecords.splice(index, 1);
    }
  };

  @computed
  get count(): number {
    return this._diaryRecords.length;
  }

  public setListner = () => {
    if (Firebase.Instance.User.uid != null) {
      Firebase.Instance.CollectionCenter.DiaryLobby.onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log(`${DiaryLobbyStore.name} diary added !!`);
          }
          if (change.type === "modified") {
            console.log(`${DiaryLobbyStore.name} Modified !! `);

            this.update(change.doc.id, change.doc.data() as DiaryRecord);
          }
          if (change.type === "removed") {
            console.log(`${DiaryLobbyStore.name} Remove Data: `, change.doc.data());

            this.remove(change.doc.id, change.doc.data() as DiaryRecord);
          }
        });
      });
    }
  };

  private upsert = (documentSnapshop: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>) => {
    const diaryRecord = documentSnapshop.data() as DiaryRecord;

    if (this.update(documentSnapshop.id, diaryRecord) == false) {
      this.add(documentSnapshop.id, diaryRecord);
    }
  };

  public getListAsync = async () => {
    this.setListner();

    const snapshot = await Firebase.Instance.CollectionCenter.getDatasAsync(this._collectionType);

    if (snapshot && snapshot.empty == false) {
      snapshot.forEach((doc) => this.upsert(doc));
    }
  };

  public findByUserId = (userId: string): DiaryRecord | undefined => {
    return this._diaryRecords.find((element) => element.userId == userId);
  };

  public findByDocumentId = (documentId: string): DiaryRecord | undefined => {
    return this._diaryRecords.find((element) => element.documentId == documentId);
  };
}

export default DiaryLobbyStore;
