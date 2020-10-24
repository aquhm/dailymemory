import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import { WhereFilterOp, OrderByDirection } from "@firebase/firestore-types";

export type CollectionType = "users" | "diaries" | "diary_records" | "diary_lobbies";

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
  wheres: Array<Where>;
  orderBy?: OrderBy;
  limit?: number;
}

class FirebaseCollectionCenter {
  private readonly _db: firebase.firestore.Firestore;

  constructor(db: firebase.firestore.Firestore) {
    this._db = db;
  }

  get db() {
    if (!this._db) {
      throw new Error("db is null");
    }

    return <firebase.firestore.Firestore>this._db;
  }
  get User() {
    return this.db.collection("users");
  }

  get Diary() {
    return this.db.collection("diaries");
  }
  get DiaryPage() {
    return this.db.collection("diary_records");
  }

  get DiaryLobby() {
    return this.db.collection("diary_lobbies");
  }

  private getCollection<T extends CollectionType>(collection: T): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    return this.db.collection(collection);
  }

  public writeDataAsync = async <T extends CollectionType>(collection: T, data: any) => {
    const col = this.getCollection(collection);
    const docRef = col.doc();

    await docRef?.set(data, { merge: true });
  };

  public removeDataAsync = async <T extends CollectionType>(collection: T, documentId: string) => {
    const docRef = this.getDocument(collection, documentId);
    return await docRef.delete();
  };

  public writeDataByDocumentIdAsync = async <T extends CollectionType>(collection: T, documentId: string, data: any) => {
    const col = this.getCollection(collection);
    const docRef = col.doc(documentId);
    await docRef?.set(data, { merge: true });
  };

  public getDataWithFilterAsync = async <T extends CollectionType>(collection: T, field: string, operator: WhereFilterOp, value: any) => {
    const col = this.getCollection(collection);
    const query = col.where(field, operator, value);

    return query.get();
  };

  public getDataWithMultiFilterAsync = async <T extends CollectionType>(collection: T, option: QueryOption) => {
    let col = this.getCollection(collection);

    let query;
    if (option.wheres.length > 0) {
      for (let w of option.wheres) {
        query = col.where(w.field, w.operator, w.value);
      }
    }

    if (option.orderBy) {
      query?.orderBy(option.orderBy.field, option.orderBy.direction);
    }

    if (option.limit) {
      query?.limit(option.limit);
    }

    return query?.get();
  };

  public createQueryWithOption = <T extends CollectionType>(collection: T, option: QueryOption) => {
    let col = this.getCollection(collection);

    let query;
    if (option.wheres.length > 0) {
      for (let w of option.wheres) {
        query = col.where(w.field, w.operator, w.value);
      }
    }

    if (option.orderBy) {
      query?.orderBy(option.orderBy.field, option.orderBy.direction);
    }

    if (option.limit) {
      query?.limit(option.limit);
    }

    return query;
  };

  public getDatasWithFilterAsync1 = async <T extends CollectionType>(collection: T, option: QueryOption) => {
    const query = this.createQueryWithOption(collection, option);
    return await query?.get();
  };

  public getDatasWithFilterAsync = async <T extends CollectionType>(collection: T, field: string, operator: WhereFilterOp, value: any) => {
    const query = this.createQuery(collection, field, operator, value);
    return await query.get();
  };

  public createQuery = <T extends CollectionType>(collection: T, field: string, operator: WhereFilterOp, value: any) => {
    const col = this.getCollection(collection);
    const query = col.where(field, operator, value);
    return query;
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

  private getDocument = <T extends CollectionType>(collection: T, documentId: string) => {
    const col = this.getCollection(collection);
    const docRef = col.doc(documentId);

    return docRef;
  };

  public getDataAsync = async <T extends CollectionType>(collection: T, documentId: string) => {
    try {
      const docRef = this.getDocument(collection, documentId);
      return docRef?.get();
    } catch (error) {
      throw new Error(`Function [${this.getDataAsync.name}] ${error}`);
    }
  };
}

export default FirebaseCollectionCenter;
