import { Diary } from "../../stores/object";
import { CollectionType } from "./Firebase";
import { SubCollectionType } from "./FirebaseCollectionCenter";

class FirebaseHelper {
  private constructor() {}

  public static ToDocumentReferencePath = (type: CollectionType, documentId: string): string => {
    return `${type}/${documentId}`;
  };

  public static ToSubCollectionReferencePath = (type: CollectionType, documentId: string, subType: SubCollectionType): string => {
    return `${type}/${documentId}/${subType}`;
  };
}

export default FirebaseHelper;
