import { action, observable, computed } from "mobx";

import Firebase, { QueryOption, CollectionType } from "../Firebase";
import * as firebase from "firebase/app";

import RootStore from "./RootStore";
import ImageApi, { StorageImagePathType } from "../apis/Image/ImageApi";
import * as _ from "lodash";
import { DiaryPageRecord } from "../shared/records";

class DiaryPageStore {
  private _currentDiaryId?: string;
  private _rootStore: RootStore;
  private _collectionType: CollectionType;
  private _latestUploadImageUri: string;

  @observable private _diaryPageRecords: Array<DiaryPageRecord> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    this._rootStore = rootStore;
    this._collectionType = collectionType;
    this._latestUploadImageUri = "";
  }

  public get values(): Array<DiaryPageRecord> {
    return this._diaryPageRecords;
  }

  @computed
  public get count(): number {
    return this._diaryPageRecords.length;
  }

  public Initialize = () => {};

  private setListner = (diaryId: string, queryOption: QueryOption) => {
    if (Firebase.Instance.user.uid != null) {
      const query = Firebase.Instance.createQueryWithOption(this._collectionType, queryOption);

      if (query) {
        query.onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              console.log(`${DiaryPageStore.name} diary added !!`);
              //if (this.findByDocumentId(change.doc.id) == null) {
              //  this.add(change.doc.data() as Diary);
              //}
            }
            if (change.type === "modified") {
              console.log(`${DiaryPageStore.name} Modified !! `);

              this.update(change.doc.id, change.doc.data() as DiaryPageRecord);
            }
            if (change.type === "removed") {
              console.log(`${DiaryPageStore.name} Remove Data: `, change.doc.data());

              this.remove(change.doc.id, change.doc.data() as DiaryPageRecord);
            }
          });
        });
      }

      return query;
    } else {
      return null;
    }
  };

  private update(documentId: string, updatedRecord: DiaryPageRecord): boolean {
    const index = this._diaryPageRecords.findIndex((t) => {
      return t.documentId === documentId;
    });

    if (index != -1) {
      updatedRecord.documentId = documentId;
      this._diaryPageRecords.splice(index, 1, updatedRecord);

      return true;
    } else {
      return false;
    }
  }

  private clear(diaryId: string) {
    if (this._currentDiaryId !== diaryId) {
      this._diaryPageRecords.slice(0, this._diaryPageRecords.length);
    }
  }

  @action
  public getDiaryList(diaryId: string) {
    this._currentDiaryId = diaryId;
    let queryOption: QueryOption = {
      wheres: [
        { field: "userId", operator: "==", value: Firebase.Instance.user.uid },
        { field: "diaryId", operator: "==", value: diaryId },
      ],
    };

    this.setListner(diaryId, queryOption);
    this.getListAsync(diaryId, queryOption);
  }

  private getListAsync = async (diaryId: string, queryOption: QueryOption) => {
    const snapshot = await Firebase.Instance.getDataWithMultiFilterAsync(this._collectionType, queryOption);
    if (snapshot != null) {
      if (snapshot.empty == false) {
        this.clear(diaryId);

        snapshot.forEach((doc) => this.upsert(doc));
      }
    }
  };

  private upsert = (documentSnapshop: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>) => {
    const diaryRecord = documentSnapshop.data() as DiaryPageRecord;

    if (this.update(documentSnapshop.id, diaryRecord) == false) {
      this.add(documentSnapshop.id, diaryRecord);
    }
  };

  private add = (documentId: string, newRecord: DiaryPageRecord): void => {
    if (documentId) {
      newRecord.documentId = documentId;
      this._diaryPageRecords.push(newRecord);
    } else {
      console.log("add : !! error" + documentId);
    }
  };

  @action
  private remove = (documentId: string, diary: DiaryPageRecord): void => {
    const index = this._diaryPageRecords.findIndex((t) => {
      return t.documentId === documentId;
    });

    if (index != -1) {
      this._diaryPageRecords.splice(index, 1);
    }
  };

  private findByUserId = (userId: string): DiaryPageRecord | undefined => {
    return this._diaryPageRecords.find((element) => element.userId == userId);
  };

  private findByDocumentId = (documentId: string): DiaryPageRecord | undefined => {
    return this._diaryPageRecords.find((element) => element.documentId == documentId);
  };

  public Add = (contents: string, uri?: string, place?: string, memoryTime?: string, uploadCompleted?: () => void) => {
    const task = this.addTask(contents, uri, place, memoryTime, (downdloadUrl: string) => {
      this._latestUploadImageUri = downdloadUrl;
      task.next();
      uploadCompleted && uploadCompleted();
    });

    task.next();
  };

  /*Todo :
  1. 이미지 업로드.
  2. Db Insert
  3. Document get
  */
  private *addTask(
    contents: string,
    uri?: string,
    place?: string,
    memoryTime?: string,
    uploadCompleted?: (downdloadUrl: string) => void
  ) {
    let filePath: string = "";
    if (uri != null) {
      filePath = ImageApi.makeStorageFilePath(StorageImagePathType.Diary, uri);
      yield ImageApi.uploadImageAsync(filePath, uri, uploadCompleted);
    }

    yield Firebase.Instance.writeDataAsync(this._collectionType, {
      contents: contents,
      imageUri: this._latestUploadImageUri,
      imagePath: filePath,
      userId: Firebase.Instance.user.uid,
      diaryId: this.rootStore.DiaryStore.currentDiaryId,
      place: place,
      memoryTime: memoryTime,
      createdTime: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public Remove = (documentId: string) => {
    if (this.findByDocumentId(documentId) != null) {
      Firebase.Instance.removeDataAsync(this._collectionType, documentId);
    }
  };

  private *removeTask(documentId: string) {}
}

export default DiaryPageStore;
