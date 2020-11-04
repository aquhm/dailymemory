import Firebase, { CollectionType } from "../../utility/Firebase/Firebase";
import { DiaryRecord } from "../../shared/records";
import { RootStore } from "../";
import { User } from ".";
import DiaryPageCenter from "../center/DiaryPageCenter";

class Diary {
  private _record: DiaryRecord;
  private _owner?: User | undefined;
  private _collectionType?: CollectionType;

  private _pageCenter?: DiaryPageCenter;

  constructor(private record: DiaryRecord, private collectionType?: CollectionType) {
    this._record = record;
    this._collectionType = collectionType;

    this._pageCenter = new DiaryPageCenter(this, "pages");
  }

  public get CollectionType() {
    return this._collectionType;
  }

  public get Record() {
    return this._record;
  }

  public set Record(value: DiaryRecord) {
    this._record = value;
  }

  public get User(): User | undefined {
    if (this._owner == null) {
      this._owner = RootStore.Instance.UserStore.findByDocumentId(this._record.userId!);
    }

    return this._owner;
  }
  // 임시
  public set User(value: User | undefined) {
    this._owner = value;
  }

  public get PageCenter() {
    return this._pageCenter;
  }

  private requstUpdate = (data: any) => {
    this._collectionType && Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, this._record.documentId, data);
  };

  public requestUpdateContentCount = () => {
    this.requstUpdate({ contentCount: this._record.contentCount + 1 });
  };
}

export default Diary;
