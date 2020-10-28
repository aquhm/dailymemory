import { action, observable, computed } from "mobx";

import Firebase from "../utility/Firebase";
import { CollectionType } from "../utility/FirebaseCollectionCenter";

import RootStore from "./RootStore";
import * as _ from "lodash";

import { UserRecord, DiaryRecord } from "../shared/records";

class DiaryLobbyStore {
  private _collectionType: CollectionType;
  private _rootStore: RootStore;

  @observable private _diaryRecords: Array<DiaryRecord> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(DiaryLobbyStore.name);

    this._collectionType = collectionType;
    this._rootStore = rootStore;
  }

  public Initialize = () => {};

  public get Values(): Array<DiaryRecord> {
    return this._diaryRecords;
  }

  @computed
  get count(): number {
    return this._diaryRecords.length;
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
      console.log("add : error documendId = " + documentId);
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

  public setListner = () => {
    if (Firebase.Instance.User.uid != null) {
      Firebase.Instance.CollectionCenter.Diary.onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log(`${DiaryLobbyStore.name} Added !!`);
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

    if (diaryRecord.userReference != null) {
      diaryRecord.userReference.get().then((res) => {
        diaryRecord.user = res.data() as UserRecord;

        console.log("diaryRecord.user = " + diaryRecord.user.profile_uri);

        if (this.update(documentSnapshop.id, diaryRecord) == false) {
          this.add(documentSnapshop.id, diaryRecord);
        }
      });
    } else {
      throw new Error("[DiaryLobbyStore] function upsert =>  diaryRecord.userReference is null");
    }
  };

  @action
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
