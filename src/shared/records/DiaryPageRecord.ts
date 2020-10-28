import BaseRecord from "./BaseRecord";

export default interface DiaryRecord extends BaseRecord {
  diaryId: string;
  userId: string;
  imageUri: string | undefined;
  memoryTime: string | undefined;
  place: string | undefined;
  contents: string;
}
