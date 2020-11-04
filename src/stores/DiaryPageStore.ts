import { action, observable, computed } from "mobx";

import Firebase, { QueryOption, CollectionType } from "../utility/Firebase/Firebase";
import * as firebase from "firebase/app";

import RootStore from "./RootStore";
import ImageApi, { StorageImagePathType } from "../apis/Image/ImageApi";
import * as _ from "lodash";
import { DiaryPageRecord, DiaryRecord } from "../shared/records";
import { Diary, DiaryPage } from "./object";
import My from "../utility/My";

class DiaryPageStore {
  private _currentDiary?: Diary;
  private _rootStore: RootStore;
  private _collectionType: CollectionType;
  private _unsubscribe?: any;

  @observable private _diaryPages: Array<DiaryPage> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    this._rootStore = rootStore;
    this._collectionType = collectionType;
  }

  @computed
  public get Values(): Array<DiaryPage> {
    return this._diaryPages;
  }

  @computed
  public get Count(): number {
    return this._diaryPages.length;
  }

  public Initialize = () => {};

  private setListnerByQuery = (queryOption: QueryOption) => {
    if (My.IsLogin) {
      const query = Firebase.Instance.CollectionCenter.createQueryWithCollectionType(this._collectionType, queryOption);

      if (query != null) {
        this._unsubscribe = query.onSnapshot((querySnapshot) => {
          this.upsertByLisner(querySnapshot.docChanges());
        });
      } else {
        // 동작 없음.
      }
    } else {
      // 동작 없음.
    }
  };

  private setListnerByCollectionReference = (
    collectionReference: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
    queryOption: QueryOption
  ) => {
    if (My.IsLogin) {
      const query = Firebase.Instance.CollectionCenter.createQueryWithCollectionReference(collectionReference, queryOption);
      if (query != null) {
        this._unsubscribe = collectionReference.onSnapshot((querySnapshot) => {
          this.upsertByLisner(querySnapshot.docChanges());
        });
      } else {
        // 동작 없음.
      }
    } else {
      // 동작 없음.
    }
  };

  @action
  private upsertByLisner = (updates: firebase.firestore.DocumentChange<firebase.firestore.DocumentData>[]) => {
    updates.forEach((change) => {
      if (change.type === "added") {
        console.log(`${DiaryPageStore.name} diary added !!`);
      } else if (change.type === "modified") {
        console.log(`${DiaryPageStore.name} Modified !! `);

        this.update(change.doc);
      } else if (change.type === "removed") {
        console.log(`${DiaryPageStore.name} Remove !!`);

        this.remove(change.doc);
      } else {
        // 동작 없음.
      }
    });
  };

  private update(documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): boolean {
    const diaryPage = this._diaryPages.find((t) => {
      return t.Record.documentId == documentData.id;
    });

    if (diaryPage != null) {
      diaryPage.Record = documentData.data() as DiaryPageRecord;
      diaryPage.Record.documentId = documentData.id;

      return true;
    } else {
      return false;
    }
  }

  private clear() {
    while (this._diaryPages.length > 0) {
      this._diaryPages.pop();
    }

    this._unsubscribe && this._unsubscribe();
  }

  @action
  public getListAsync = async (dairy: Diary) => {
    if (this._currentDiary !== dairy) {
      this._currentDiary = dairy;
      this.clear();
    }

    let queryOption: QueryOption = {
      wheres: [
        { field: "userId", operator: "==", value: dairy.Record.userId },
        { field: "diaryId", operator: "==", value: dairy.Record.documentId },
      ],
    };

    this.setListnerByQuery(queryOption);

    const snapshot = await Firebase.Instance.CollectionCenter.getDataByCollectionTypeAsync(this._collectionType, queryOption);

    if (snapshot != null && snapshot.empty == false) {
      snapshot.forEach((doc) => this.upsert(doc));
    }
  };

  @action
  public getListBySubCollectionAsync = async (dairy: Diary) => {
    const pagesCollectionReference = dairy.PageCenter!.PagesCollectionReference;
    if (pagesCollectionReference != null) {
      if (this._currentDiary !== dairy) {
        this._currentDiary = dairy;
        this.clear();
      }

      let queryOption: QueryOption = {
        orderBy: { field: "createdTime", direction: "asc" },
      };

      this.setListnerByCollectionReference(pagesCollectionReference, queryOption);

      const snapshot = await Firebase.Instance.CollectionCenter.getDataByCollectionReferenceAsync(pagesCollectionReference, queryOption);
      if (snapshot != null && snapshot.empty == false) {
        snapshot.forEach((doc) => this.upsert(doc));

        dairy.PageCenter!.Pages = this.Values;
      }
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
  private add = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): void => {
    const newRecord = documentData.data() as DiaryPageRecord;
    newRecord.documentId = documentData.id;

    const newDiary = new DiaryPage(newRecord);
    //newDiary.Owner = ownerRecord;
    this._diaryPages.push(newDiary);
  };

  @action
  private remove = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): void => {
    const index = this._diaryPages.findIndex((t) => {
      return t.Record.documentId === documentData.id;
    });

    if (index != -1) {
      this._diaryPages.splice(index, 1);
    }
  };

  private findByUserId = (userId: string): DiaryPage | undefined => {
    return this._diaryPages.find((t) => t.Record.userId == userId);
  };

  private findByDocumentId = (documentId: string): DiaryPage | undefined => {
    return this._diaryPages.find((t) => t.Record.documentId == documentId);
  };

  private requstUpdate = (diaryPageRecord: DiaryPageRecord, data: any) => {
    if (this.findByDocumentId(diaryPageRecord.documentId)) {
      Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, diaryPageRecord.documentId, data);
    }
  };

  public Create = (diary: Diary, contents: string, uri: string, place: string, memoryTime?: string, addCompleted?: () => void) => {
    const task = this.createTask(
      diary,
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
    diary: Diary,
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

    yield diary.PageCenter?.PagesCollectionReference &&
      Firebase.Instance.CollectionCenter.writeDataToCollectionReferenceAsync(diary.PageCenter?.PagesCollectionReference, {
        contents: contents,
        place: place,
        memoryTime: memoryTime,
        imageUri: downloadImageUri,
        imagePath: storagePath,
        userId: Firebase.Instance.User.uid,
        diaryId: diary.Record.documentId,
        createdTime: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        this._rootStore.DiaryStore.requestUpdateContentCount(diary);
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
