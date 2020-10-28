import { CollectionType } from "./Firebase";

class FirebaseHelper {
  private constructor() {}

  public static ToDocumentReferencePath = (type: CollectionType, documentId: string): string => {
    return `${type}/${documentId}`;
  };
}

export default FirebaseHelper;
