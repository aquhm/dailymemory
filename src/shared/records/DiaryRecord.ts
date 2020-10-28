import { UserRecord, BaseRecord } from ".";

export default interface DiaryRecord extends BaseRecord {
  title: string;
  coverImageUri?: string | undefined;
  coverImagePath?: string | undefined;
  userId: string | undefined;
  contentCount: number;
  createdTime?: firebase.firestore.FieldValue;
  private?: boolean;
  userReference?: firebase.firestore.DocumentReference;
  user?: UserRecord;
}
