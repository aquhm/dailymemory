import Firebase, { CollectionType } from "../../utility/Firebase";
import { DiaryRecord, UserRecord } from "../../shared/records";

class Diary {
  private _record: DiaryRecord;
  private _owner?: UserRecord;
  private _collectionType?: CollectionType;

  constructor(private record: DiaryRecord, private owner?: UserRecord, private collectionType?: CollectionType) {
    this._record = record;
    this._owner = owner;
    this._collectionType = collectionType;
  }

  public get Record() {
    return this._record;
  }

  public set Record(value: DiaryRecord) {
    this._record = value;
  }

  public get Owner() {
    return this._owner;
  }

  private RequstUpdate = (data: any) => {
    this._collectionType && Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, this._record.documentId, data);
  };

  public RequestUpdateContentCount = () => {
    this.RequstUpdate({ contentCount: this._record.contentCount + 1 });
  };
}

export default Diary;
