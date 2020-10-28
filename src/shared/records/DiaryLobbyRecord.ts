import { DiaryRecord, UserRecord } from ".";
import Firebase from "../../utility/Firebase";

export default interface DiaryLobbyRecord extends DiaryRecord {
  userReference: firebase.firestore.DocumentReference;
  user: UserRecord;
}
