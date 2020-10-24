import { action, observable, computed } from "mobx";

import * as firebase from "firebase/app";
import Firebase, { QueryOption, CollectionType } from "../utility/Firebase";

import RootStore from "./RootStore";
import ImageApi, { StorageImagePathType } from "../apis//Image/ImageApi";
import * as _ from "lodash";

import { DiaryRecord } from "../shared/records";

class DiaryStore {
  private _collectionType: CollectionType;
  private _currentDiaryId?: string;
  private _rootStore: RootStore;

  @observable private _diaryRecords: Array<DiaryRecord> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(DiaryStore.name);

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

  public setListner = (queryOption: QueryOption) => {
    if (Firebase.Instance.User.uid != null) {
      const query = Firebase.Instance.CollectionCenter.createQueryWithOption(this._collectionType, queryOption);

      if (query) {
        query.onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              console.log(`${DiaryStore.name} diary added !!`);
            }
            if (change.type === "modified") {
              console.log(`${DiaryStore.name} Modified !! `);

              this.update(change.doc.id, change.doc.data() as DiaryRecord);
            }
            if (change.type === "removed") {
              console.log(`${DiaryStore.name} Remove Data: `, change.doc.data());

              this.remove(change.doc.id, change.doc.data() as DiaryRecord);
            }
          });
        });
      }
    }
  };

  public getListAsync = async () => {
    let queryOption: QueryOption = {
      wheres: [{ field: "userId", operator: "==", value: Firebase.Instance.User.uid }],
    };

    this.setListner(queryOption);

    const snapshot = await Firebase.Instance.CollectionCenter.getDatasWithFilterAsync1(this._collectionType, queryOption);

    if (snapshot && snapshot.empty == false) {
      snapshot.forEach((doc) => {
        if (this.update(doc.id, doc.data() as DiaryRecord) == false) {
          this.add(doc.id, doc.data() as DiaryRecord);
        }
      });
    }
  };

  public findByUserId = (userId: string): DiaryRecord | undefined => {
    return this._diaryRecords.find((element) => element.userId == userId);
  };

  public findByDocumentId = (documentId: string): DiaryRecord | undefined => {
    return this._diaryRecords.find((element) => element.documentId == documentId);
  };

  private requstUpdate = (diaryRecord: DiaryRecord, data: any) => {
    if (this.findByDocumentId(diaryRecord.documentId)) {
      Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, diaryRecord.documentId, data);
    }
  };

  public requestUpdateContentCount(diaryRecord: DiaryRecord) {
    this.requstUpdate(diaryRecord, { contentCount: diaryRecord.contentCount + 1 });
  }

  public Create = (title: string, open: boolean, uri: string, addCompleted?: () => void) => {
    const task = this.createTask(
      title,
      open,
      uri,
      (downloadImageUri: string) => {
        task.next(downloadImageUri);
      },
      addCompleted
    );

    task.next();
  };

  /*Todo :
  1. 이미지 업로드.
  2. Db Insert
  3. Document get
  */
  private *createTask(title: string, open: boolean, imageFileUri: string, imageUploadComplete?: (downloadImageUri: string) => void, addCompleted?: () => void) {
    let storagePath: string = "";
    let downloadImageUri: string = "";
    if (_.isEmpty(imageFileUri) == false) {
      storagePath = ImageApi.makeStorageFilePath(StorageImagePathType.DiaryCover, imageFileUri);
      yield ImageApi.uploadImageAsync(storagePath, imageFileUri, (downloadUri) => {
        downloadImageUri = downloadUri;
        imageUploadComplete && imageUploadComplete(downloadUri);
      });
    }

    yield Firebase.Instance.CollectionCenter.writeDataAsync(this._collectionType, {
      title: title,
      open: open,
      coverImageUri: downloadImageUri,
      coverImagePath: storagePath,
      userId: Firebase.Instance.User.uid,
      createdTime: firebase.firestore.FieldValue.serverTimestamp(),
      contentCount: 0,
    }).then(() => {
      addCompleted && addCompleted();
    });
  }
}

export default DiaryStore;
