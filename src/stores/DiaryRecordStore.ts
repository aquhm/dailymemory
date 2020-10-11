import { action, observable, computed } from "mobx";

import Firebase, { QueryOption, CollectionType } from "../Firebase";
import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import RootStore from "./RootStore";
import ImageApi, { StorageImagePathType } from "../apis//Image/ImageApi";
import * as _ from "lodash";

export interface DiaryRecord {
  documentId: string;
  diaryId: string;
  userId: string;
  imageUri?: string | undefined;
  memoryTime: string | undefined;
  place: string | undefined;
  contents: string;
}

class DiaryRecordStore {
  private _currentDiaryId?: string;
  private _rootStore: RootStore;
  private _collectionType: CollectionType;
  private _latestUploadImageUri: string;

  @observable private _diaryRecords: Array<DiaryRecord> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(DiaryRecordStore.name);

    this._rootStore = rootStore;
    this._collectionType = collectionType;
    this._latestUploadImageUri = "";
  }

  public Initialize = () => {};

  private setListner = (diaryId: string, queryOption: QueryOption) => {
    if (Firebase.Instance.user.uid != null) {
      const query = Firebase.Instance.createQueryWithOption(this._collectionType, queryOption);

      if (query) {
        query.onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              console.log(`${DiaryRecordStore.name} diary added !!`);
              //if (this.findByDocumentId(change.doc.id) == null) {
              //  this.add(change.doc.data() as Diary);
              //}
            }
            if (change.type === "modified") {
              console.log(`${DiaryRecordStore.name} Modified !! `);

              this.update(change.doc.id, change.doc.data() as DiaryRecord);
            }
            if (change.type === "removed") {
              console.log(`${DiaryRecordStore.name} Remove Data: `, change.doc.data());

              this.remove(change.doc.id, change.doc.data() as DiaryRecord);
            }
          });
        });
      }

      return query;
    } else {
      return null;
    }
  };

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

  private clear(diaryId: string) {
    if (this._currentDiaryId !== diaryId) {
      this._diaryRecords.slice(0, this._diaryRecords.length);
    }
  }
  public getDiaryList(diaryId: string) {
    this.clear(diaryId);

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

  public getListAsync = async (diaryId: string, queryOption: QueryOption) => {
    const snapshot = await Firebase.Instance.getDataWithMultiFilterAsync(this._collectionType, queryOption);
    if (snapshot != null) {
      if (snapshot.empty == false) {
        snapshot.forEach((doc) => {
          if (this.update(doc.id, doc.data() as DiaryRecord) == false) {
            this.add(doc.id, doc.data() as DiaryRecord);
          }
        });
      }
    }
  };

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

  private findByUserId = (userId: string): DiaryRecord | undefined => {
    return this._diaryRecords.find((element) => element.userId == userId);
  };

  private findByDocumentId = (documentId: string): DiaryRecord | undefined => {
    return this._diaryRecords.find((element) => element.documentId == documentId);
  };

  public get values(): Array<DiaryRecord> {
    return this._diaryRecords;
  }

  @computed
  get count(): number {
    return this._diaryRecords.length;
  }

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

    yield Firebase.Instance.writeData(this._collectionType, {
      contents: contents,
      imageUri: this._latestUploadImageUri,
      imagePath: filePath,
      userId: Firebase.Instance.user.uid,
      diaryId: this._currentDiaryId,
      place: place,
      memoryTime: memoryTime,
      createdTime: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public Remove = (documentId: string) => {
    if (this.findByDocumentId(documentId) != null) {
      Firebase.Instance.removeData(this._collectionType, documentId);
    }
  };

  private *removeTask(documentId: string) {}
}

export default DiaryRecordStore;
