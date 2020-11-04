import Firebase, { CollectionType } from "../../utility/Firebase/Firebase";
import { DiaryPageRecord, UserRecord } from "../../shared/records";

class DiaryPage {
  private _record: DiaryPageRecord;
  private _owner?: UserRecord;
  private _collectionType?: CollectionType;

  constructor(private record: DiaryPageRecord, private owner?: UserRecord, private collectionType?: CollectionType) {
    this._record = record;
    this._owner = owner;
    this._collectionType = collectionType;
  }

  public get Record() {
    return this._record;
  }

  public set Record(value: DiaryPageRecord) {
    this._record = value;
  }

  public get Owner() {
    return this._owner;
  }

  private RequstUpdate = (data: any) => {
    this._collectionType && Firebase.Instance.CollectionCenter.updateDataByDocumentIdAsync(this._collectionType, this._record.documentId, data);
  };
}

export default DiaryPage;
