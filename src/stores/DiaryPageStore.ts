import { action, observable, computed } from "mobx";

import Firebase, { QueryOption, CollectionType } from "../utility/Firebase";
import * as firebase from "firebase/app";

import RootStore from "./RootStore";
import ImageApi, { StorageImagePathType } from "../apis/Image/ImageApi";
import * as _ from "lodash";
import { DiaryPageRecord, DiaryRecord } from "../shared/records";

class DiaryPageStore {
  private _currentDiaryId?: string;
  private _rootStore: RootStore;
  private _collectionType: CollectionType;

  @observable private _diaryPageRecords: Array<DiaryPageRecord> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    this._rootStore = rootStore;
    this._collectionType = collectionType;
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
    if (Firebase.Instance.User.uid != null) {
      const query = Firebase.Instance.CollectionCenter.createQueryWithOption(this._collectionType, queryOption);

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
        { field: "userId", operator: "==", value: Firebase.Instance.User.uid },
        { field: "diaryId", operator: "==", value: diaryId },
      ],
    };

    this.setListner(diaryId, queryOption);
    this.getListAsync(diaryId, queryOption);
  }

  private getListAsync = async (diaryId: string, queryOption: QueryOption) => {
    const snapshot = await Firebase.Instance.CollectionCenter.getDataWithMultiFilterAsync(this._collectionType, queryOption);
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

  private requstUpdate = (diaryPageRecord: DiaryPageRecord, data: any) => {
    if (this.findByDocumentId(diaryPageRecord.documentId)) {
      Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, diaryPageRecord.documentId, data);
    }
  };

  public Create = (diaryRecord: DiaryRecord, contents: string, uri: string, place: string, memoryTime?: string, addCompleted?: () => void) => {
    const task = this.createTask(
      diaryRecord,
      contents,
      uri,
      place,
      memoryTime,
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
  private *createTask(
    diaryRecord: DiaryRecord,
    contents: string,
    imageFileUri: string,
    place: string,
    memoryTime?: string,
    imageUploadComplete?: (downloadImageUri: string) => void,
    addCompleted?: () => void
  ) {
    let storagePath: string = "";
    let downloadImageUri: string = "";
    if (_.isEmpty(imageFileUri) == false) {
      storagePath = ImageApi.makeStorageFilePath(StorageImagePathType.Diary, imageFileUri);
      yield ImageApi.uploadImageAsync(storagePath, imageFileUri, (downloadUri) => {
        downloadImageUri = downloadUri;
        imageUploadComplete && imageUploadComplete(downloadUri);
      });
    }

    yield Firebase.Instance.CollectionCenter.writeDataAsync(this._collectionType, {
      contents: contents,
      place: place,
      memoryTime: memoryTime,
      imageUri: downloadImageUri,
      imagePath: storagePath,
      userId: Firebase.Instance.User.uid,
      diaryId: diaryRecord.documentId,
      createdTime: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      this._rootStore.DiaryStore.requestUpdateContentCount(diaryRecord);
      addCompleted && addCompleted();
    });
  }

  public Remove = (documentId: string) => {
    if (this.findByDocumentId(documentId) != null) {
      Firebase.Instance.CollectionCenter.removeDataAsync(this._collectionType, documentId);
    }
  };

  private *removeTask(documentId: string) {}
}

export default DiaryPageStore;
