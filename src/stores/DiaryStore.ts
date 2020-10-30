import { action, observable, computed, runInAction, configure } from "mobx";

import * as firebase from "firebase/app";
import Firebase, { QueryOption, CollectionType } from "../utility/Firebase";

import RootStore from "./RootStore";
import ImageApi, { StorageImagePathType } from "../apis//Image/ImageApi";
import * as _ from "lodash";

import { DiaryRecord, UserRecord } from "../shared/records";
import My from "../utility/My";

import { Diary } from "./object";
/*Todo:
 
*/
configure({ enforceActions: "observed" });

class DiaryStore {
  private _collectionType: CollectionType;
  private _currentDiaryId?: string;
  private _currentUserId?: string;
  private _rootStore: RootStore;
  private _unsubscribe?: any;

  @observable
  private _diaries: Array<Diary> = [];

  constructor(private rootStore: RootStore, private collectionType: CollectionType) {
    console.log(DiaryStore.name);

    this._collectionType = collectionType;
    this._rootStore = rootStore;
  }

  public Initialize = () => {};

  @computed
  public get Values(): Array<Diary> {
    return this._diaries;
  }

  @computed
  get Count(): number {
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
  private upsertByLisner = (updates: firebase.firestore.DocumentChange<firebase.firestore.DocumentData>[]) => {
    updates.forEach((change) => {
      if (change.type === "added") {
        console.log(`${DiaryStore.name} diary added !!`);
      }
      if (change.type === "modified") {
        console.log(`${DiaryStore.name} Modified !! `);

        this.update(change.doc);
      }
      if (change.type === "removed") {
        console.log(`${DiaryStore.name} Remove Data: `, change.doc.data());

        this.remove(change.doc);
      }
    });
  };

  @action
  public getListAsync = async (userId: string) => {
    if (this._currentUserId != userId) {
      this._currentUserId = userId;
      runInAction(() => this.clear());
    }

    let queryOption: QueryOption = {
      wheres: [{ field: "userId", operator: "==", value: userId }],
    };

    this.setListner(queryOption);

    const snapshot = await Firebase.Instance.CollectionCenter.getDatasWithFilterAsync1(this._collectionType, queryOption);

    if (snapshot != null && snapshot.empty == false) {
      const [first] = snapshot.docs;

      const userRecod = await this.getUserRecordAsync(first.data() as DiaryRecord);

      runInAction(() => {
        snapshot.forEach((doc) => this.upsert(doc, userRecod));
      });
    }
  };

  public get currentDiaryId(): string | undefined {
    if (this._currentDiaryId == null) {
      if (this.Values.length == 1) this._currentDiaryId = this.Values[0].Record.documentId;
    }

    return this._currentDiaryId;
  }

  public set currentDiaryId(id: string | undefined) {
    this._currentDiaryId = id;
  }

  private setListner = (queryOption: QueryOption) => {
    if (My.IsLogin) {
      const query = Firebase.Instance.CollectionCenter.createQueryWithOption(this._collectionType, queryOption);

      if (query != null) {
        this._unsubscribe = query.onSnapshot((querySnapshot) => {
          this.upsertByLisner(querySnapshot.docChanges());
        });
      } else {
        // 동작 없음.
      }
    } else {
      //동작 없음.
    }
  };
  private upsert = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>, ower: UserRecord) => {
    if (this.update(documentData) == false) {
      this.add(documentData, ower);
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

  private add = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>, ownerRecord: UserRecord): void => {
    const newRecord = documentData.data() as DiaryRecord;
    newRecord.documentId = documentData.id;

    const newDiary = new Diary(newRecord, this.collectionType);
    //newDiary.Owner = ownerRecord;
    this._diaries.push(newDiary);
  };

  private remove = (documentData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): void => {
    const index = this._diaries.findIndex((t) => {
      return t.Record.documentId === documentData.id;
    });

    if (index != -1) {
      this._diaries.splice(index, 1);
    }
  };

  private getUserRecordAsync = async (record: DiaryRecord) => {
    const user = await record?.userReference?.get();
    return user?.data() as UserRecord;
  };

  public findByUserId = (userId: string): Diary | undefined => {
    return this._diaries.find((t) => t.Record.userId == userId);
  };

  public findByDocumentId = (documentId: string): Diary | undefined => {
    return this._diaries.find((t) => t.Record.documentId == documentId);
  };

  private requstUpdate = (diary: Diary, data: any) => {
    if (this.findByDocumentId(diary.Record.documentId)) {
      Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, diary.Record.documentId, data);
    }
  };

  public requestUpdateContentCount(diary: Diary) {
    this.requstUpdate(diary, { contentCount: diary.Record.contentCount + 1 });
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

  /*Todo
  1. Image Upload
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
      userId: My.UserId,
      userReference: My.UserDocumentReference,
      createdTime: firebase.firestore.FieldValue.serverTimestamp(),
      contentCount: 0,
    }).then(() => {
      addCompleted && addCompleted();
    });
  }
}

export default DiaryStore;
