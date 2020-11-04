import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import { WhereFilterOp, OrderByDirection } from "@firebase/firestore-types";
import FirebaseHelper from "./FirebaseHelper";

export type CollectionType = "users" | "diaries" | "diary_records";
export type SubCollectionType = "pages";

export interface Where {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export interface OrderBy {
  field: string;
  direction?: OrderByDirection;
}

export interface QueryOption {
  wheres?: Array<Where>;
  orderBy?: OrderBy;
  limit?: number;
}

class FirebaseCollectionCenter {
  private readonly _db: firebase.firestore.Firestore;

  constructor(db: firebase.firestore.Firestore) {
    this._db = db;
  }

  private get Db() {
    if (!this._db) {
      throw new Error("db is null");
    }

    return <firebase.firestore.Firestore>this._db;
  }
  get User() {
    return this.Db.collection("users");
  }

  get Diary() {
    return this.Db.collection("diaries");
  }

  get DiaryPage() {
    return this.Db.collection("diary_records");
  }

  public getCollection<T extends CollectionType>(collection: T): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    return this.Db.collection(collection);
  }

  public getSubCollection<T1 extends CollectionType, T2 extends SubCollectionType>(
    collection: T1,
    documentId: string,
    subCollection: T2
  ): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    return this.Db.collection(FirebaseHelper.ToSubCollectionReferencePath(collection, documentId, subCollection));
  }

  public getDocument = <T extends CollectionType>(collection: T, documentId: string) => {
    const col = this.getCollection(collection);
    const docRef = col.doc(documentId);

    return docRef;
  };

  public writeDataAsync = async <T extends CollectionType>(collection: T, data: any) => {
    const col = this.getCollection(collection);
    const docRef = col.doc();
    +(await docRef?.set(data, { merge: true }));
  };

  public writeDataToCollectionReferenceAsync = async (collection: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>, data: any) => {
    if (collection) {
      const docRef = collection.doc();

      await docRef?.set(data, { merge: true });
    }
  };

  public writeDataByDocumentIdAsync = async <T extends CollectionType>(collection: T, documentId: string, data: any) => {
    const col = this.getCollection(collection);
    const docRef = col.doc(documentId);
    await docRef?.set(data, { merge: true });
  };

  public createQuery = <T extends CollectionType>(collection: T, field: string, operator: WhereFilterOp, value: any) => {
    const col = this.getCollection(collection);
    const query = col.where(field, operator, value);
    return query;
  };

  public createQueryWithCollectionType = <T extends CollectionType>(collection: T, option: QueryOption) => {
    let { wheres, orderBy, limit } = option;

    let colRef = this.getCollection(collection);

    let query;
    if (wheres) {
      for (let w of wheres) {
        query = colRef.where(w.field, w.operator, w.value);
      }
    }

    if (orderBy) {
      query?.orderBy(orderBy.field, orderBy.direction);
    }

    if (limit) {
      query?.limit(limit);
    }

    return query;
  };

  public createQueryWithCollectionReference = (
    collectionReference: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
    option: QueryOption
  ) => {
    const { wheres, orderBy, limit } = option;

    let query;
    if (wheres) {
      for (const w of wheres) {
        query = collectionReference.where(w.field, w.operator, w.value);
      }
    } else {
      query = collectionReference;
    }

    if (orderBy) {
      query?.orderBy(orderBy.field, orderBy.direction);
    }

    if (limit) {
      query?.limit(limit);
    }

    return query;
  };

  public getDatasAsync = async <T extends CollectionType>(collection: T) => {
    try {
      const col = this.getCollection(collection);
      return col?.get();
    } catch (error) {
      throw new Error(`Function [${this.getDataAsync.name}] ${error}`);
    }
  };

  public getDataAsync = async <T extends CollectionType>(collection: T, documentId: string) => {
    try {
      const docRef = this.getDocument(collection, documentId);
      return docRef?.get();
    } catch (error) {
      throw new Error(`Function [${this.getDataAsync.name}] ${error}`);
    }
  };

  public getDataWithFilterAsync = async <T extends CollectionType>(collection: T, field: string, operator: WhereFilterOp, value: any) => {
    const col = this.getCollection(collection);
    const query = col.where(field, operator, value);

    return query.get();
  };

  public getDatasWithFilterAsync = async <T extends CollectionType>(collection: T, field: string, operator: WhereFilterOp, value: any) => {
    const query = this.createQuery(collection, field, operator, value);
    return await query.get();
  };

  public getDataByCollectionTypeAsync = async <T extends CollectionType>(collection: T, option?: QueryOption) => {
    if (option != null) {
      const query = this.createQueryWithCollectionType(collection, option);
      return query?.get();
    } else {
      return this.getDatasAsync(collection);
    }
  };

  public getDataByCollectionReferenceAsync = async (
    collectionReference: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
    option?: QueryOption
  ) => {
    if (option != null) {
      const query = this.createQueryWithCollectionReference(collectionReference, option);

      return query?.get();
    } else {
      return collectionReference.get();
    }
  };

  public updateDataByDocumentIdAsync = async <T extends CollectionType>(
    collection: T,
    documentId: string,
    data: any,
    onComplete?: (a: Error | null) => any
  ) => {
    const docRef = this.getDocument(collection, documentId);

    await docRef?.update(data);
  };

  public removeDataAsync = async <T extends CollectionType>(collection: T, documentId: string) => {
    const docRef = this.getDocument(collection, documentId);
    return await docRef.delete();
  };
}

export default FirebaseCollectionCenter;
