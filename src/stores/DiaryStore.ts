import { action, observable, computed } from "mobx";

import Firebase from "../Firebase";
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
  userId: string | undefined;
  contentCount: Number;
}

class DiaryStore {
  private _rootStore: RootStore;

  @observable private _diaries: Array<Diary> = [];

  constructor(private rootStore: RootStore) {
    console.log(DiaryStore.name);

    this._rootStore = rootStore;
  }

  public Initialize = () => {};

  public registerQueryListner = () => {
    if (Firebase.Instance.user.uid != null) {
      const query = Firebase.Instance.createQuary("diaries", "userId", "==", Firebase.Instance.user.uid);

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
    const snapshot = await Firebase.Instance.getDatasWithFilterAsync(
      "diaries",
      "userId",
      "==",
      Firebase.Instance.user.uid
    );

    if (snapshot.empty == false) {
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
    const task = this.addTask(title, uri, () => {
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
  private *addTask(title: string, uri?: string, uploadCompleted?: () => void) {
    if (uri != null) {
      yield ImageApi.uploadImageAsync(StorageImagePathType.DiaryCover, uri, uploadCompleted);
    }

    yield Firebase.Instance.writeData("diaries", {
      title: title,
      coverImageUri: uri,
      userId: Firebase.Instance.user.uid,
    });
  }
}

export default DiaryStore;
