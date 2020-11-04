import Firebase, { CollectionType } from "../../utility/Firebase/Firebase";

import { RootStore } from "../";
import { Diary, DiaryPage, User } from "../object";
import { SubCollectionType } from "../../utility/Firebase/FirebaseCollectionCenter";

class DiaryPageCenter {
  private _owner: Diary;
  private _pages?: Array<DiaryPage> = [];
  private readonly _subCollectionType?: SubCollectionType;

  constructor(private owner: Diary, private subCollectionType: SubCollectionType) {
    this._owner = owner;
    this._subCollectionType = subCollectionType;
  }

  public get Pages() {
    return this._pages!;
  }

  public set Pages(value: Array<DiaryPage>) {
    this._pages = value;
  }

  public get User(): User | undefined {
    return RootStore.Instance.UserStore.findByDocumentId(this._owner.Record.userId!);
  }

  public get PagesCollectionReference(): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    const diaryCollectionRef = Firebase.Instance.CollectionCenter.Diary;
    const pageCollectionRef = diaryCollectionRef.doc(this._owner.Record.documentId).collection(this._subCollectionType!);

    return pageCollectionRef;
  }

  public getListAsync = async () => await RootStore.Instance.DiaryPageStore.getListBySubCollectionAsync(this._owner);
}

export default DiaryPageCenter;
