export default interface DiaryRecord {
  documentId: string;
  diaryId: string;
  userId: string;
  imageUri?: string | undefined;
  memoryTime: string | undefined;
  place: string | undefined;
  contents: string;
}
