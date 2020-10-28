import { RootStore } from "../stores";
import Firebase, { CollectionType } from "./Firebase";

class My {
  private constructor() {}

  public static get UserId(): string {
    return Firebase.Instance.User.uid;
  }

  public static get UserDocumentReference() {
    return Firebase.Instance.CollectionCenter.getDocument("users", My.UserId);
  }

  public static get IsLogin() {
    return RootStore.Instance.AuthStore.isAuthenticated;
  }

  public static LatestDiariesAsync = async () => {
    await RootStore.Instance.DiaryStore.getListAsync(My.UserId);
  };
}

export default My;
