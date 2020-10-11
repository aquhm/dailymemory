import { action, observable, computed } from "mobx";

import * as firebase from "firebase/app";
import Firebase, { QueryOption, CollectionType } from "../Firebase";
0;
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import RootStore from "./RootStore";
import ImageApi, { StorageImagePathType } from "../apis//Image/ImageApi";
import * as _ from "lodash";

import { v4 as uuid } from "uuid";

export interface Diary {
  documentId: string;
  title: string;
  coverImageUri?: string | undefined;
  coverImagePath?: string | undefined;
  userId: string | undefined;
  contentCount: Number;
  createdTime: firebase.firestore.FieldValue;
}

class DiaryStore {
  private _collectionType: CollectionType;
  private _rootStore: RootStore;
  private _latestUploadImageUri: string;

  @observable private _diaries: Array<Diary> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(DiaryStore.name);

    this._collectionType = collectionType;
    this._latestUploadImageUri = "";
    this._rootStore = rootStore;
  }

  public Initialize = () => {};

  public setListner = (queryOption: QueryOption) => {
    if (Firebase.Instance.user.uid != null) {
      const query = Firebase.Instance.createQueryWithOption(this._collectionType, queryOption);

      if (query) {
        query.onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              console.log(`${DiaryStore.name} diary added !!`);
              //if (this.findByDocumentId(change.doc.id) == null) {
              //  this.add(change.doc.data() as Diary);
              //}
            }
            if (change.type === "modified") {
              console.log(`${DiaryStore.name} Modified !! `);

              this.update(change.doc.id, change.doc.data() as Diary);
            }
            if (change.type === "removed") {
              console.log(`${DiaryStore.name} Remove Data: `, change.doc.data());

              this.remove(change.doc.id, change.doc.data() as Diary);
            }
          });
        });
      }
    }
  };

  @action
  private update(documentId: string, updatedRecord: Diary): boolean {
    const index = this._diaries.findIndex((t) => {
      return t.documentId === documentId;
    });

    if (index != -1) {
      updatedRecord.documentId = documentId;
      this._diaries.splice(index, 1, updatedRecord);

      return true;
    } else {
      return false;
    }
  }

  public getListAsync = async () => {
    let queryOption: QueryOption = {
      wheres: [{ field: "userId", operator: "==", value: Firebase.Instance.user.uid }],
    };

    this.setListner(queryOption);

    const snapshot = await Firebase.Instance.getDatasWithFilterAsync1(this._collectionType, queryOption);

    if (snapshot && snapshot.empty == false) {
      snapshot.forEach((doc) => {
        if (this.update(doc.id, doc.data() as Diary) == false) {
          this.add(doc.id, doc.data() as Diary);
        }
      });
    }
  };

  @action
  private add = (documentId: string, newRecord: Diary): void => {
    if (documentId) {
      newRecord.documentId = documentId;
      this._diaries.push(newRecord);
    } else {
      console.log("add : !! error" + documentId);
    }
  };

  @action
  private remove = (documentId: string, diary: Diary): void => {
    const index = this._diaries.findIndex((t) => {
      return t.documentId === documentId;
    });

    if (index != -1) {
      this._diaries.splice(index, 1);
    }
  };

  private findByUserId = (userId: string): Diary | undefined => {
    return this._diaries.find((element) => element.userId == userId);
  };

  private findByDocumentId = (documentId: string): Diary | undefined => {
    return this._diaries.find((element) => element.documentId == documentId);
  };

  public get values(): Array<Diary> {
    return this._diaries;
  }

  @computed
  get count(): number {
    return this._diaries.length;
  }

  public Add = (title: string, uri?: string, uploadCompleted?: () => void) => {
    const task = this.addTask(title, uri, (downloadUrl: string) => {
      this._latestUploadImageUri = downloadUrl;
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
  private *addTask(title: string, uri?: string, uploadCompleted?: (downloadUrl: string) => void) {
    let filePath: string = "";
    if (uri != null) {
      filePath = ImageApi.makeStorageFilePath(StorageImagePathType.DiaryCover, uri);
      yield ImageApi.uploadImageAsync(filePath, uri, uploadCompleted);
    }

    yield Firebase.Instance.writeData("diaries", {
      title: title,
      coverImageUri: this._latestUploadImageUri,
      coverImagePath: filePath,
      userId: Firebase.Instance.user.uid,
      createdTime: firebase.firestore.FieldValue.serverTimestamp(),
      contentCount: 0,
    });
  }
}

export default DiaryStore;
