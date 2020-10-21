export default interface DiaryRecord {
  documentId: string;
  title: string;
  coverImageUri?: string | undefined;
  coverImagePath?: string | undefined;
  userId: string | undefined;
  contentCount: Number;
  createdTime?: firebase.firestore.FieldValue;
}
