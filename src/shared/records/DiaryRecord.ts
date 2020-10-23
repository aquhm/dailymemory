export default interface DiaryRecord {
  documentId: string;
  title: string;
  coverImageUri?: string | undefined;
  coverImagePath?: string | undefined;
  userId: string | undefined;
  contentCount: number;
  createdTime?: firebase.firestore.FieldValue;
  private?: boolean;
}
