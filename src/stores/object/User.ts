import { CollectionType } from "../../utility/Firebase";
import { UserRecord } from "../../shared/records";

class User {
  private _record: UserRecord;
  private _collectionType?: CollectionType;

  constructor(private record: UserRecord, private collectionType?: CollectionType) {
    this._record = record;
    this._collectionType = collectionType;
  }

  public get Record() {
    return this._record;
  }

  public set Record(value: UserRecord) {
    this._record = value;
  }
}

export default User;
