import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

import { WhereFilterOp, OrderByDirection } from "@firebase/firestore-types";

import ApiKeys from "../constants/ApiKeys";

export type CollectionType = "users" | "diaries" | "diary_records";

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

class Firebase {
  //private firebase.auth.AuthProvider _googleProvider;

  private _app?: firebase.app.App;
  private _auth?: firebase.auth.Auth;
  private _db?: firebase.firestore.Firestore;
  private _storage?: firebase.storage.Storage;
  static _firebase?: Firebase;

  static get Instance() {
    if (!this._firebase) {
      this._firebase = new Firebase();
      return this._firebase;
    } else {
      return this._firebase;
    }
  }

  private constructor() {
    this.init();
  }

  init = () => {
    try {
      if (firebase.apps.length == 0) {
        this._app = firebase.initializeApp(ApiKeys.FirebaseConfig);
      }
    } catch (err) {
      console.error("Firebase initialization error : ", err.stack);
    }

    this._auth = firebase.auth();
    this._db = firebase.firestore();
    this._storage = firebase.storage();
    //this._googleProvider = new firebase.auth.GoogleAuthProvider()
    //this._facebookProvider = new firebase.auth.FacebookAuthProvider()

    console.log("Firebase Initialized");
  };

  get storage() {
    if (!this._storage) {
      throw new Error("storage is null");
    }

    return <firebase.storage.Storage>this._storage;
  }

  get db() {
    if (!this._db) {
      throw new Error("db is null");
    }

    return <firebase.firestore.Firestore>this._db;
  }

  get auth() {
    if (!this._auth) {
      throw new Error("auth is null");
    }

    return this._auth;
  }

  get user() {
    if (!this.auth.currentUser) {
      throw new Error("auth.currentUser is null");
    }

    return this.auth.currentUser;
  }

  get userCollection() {
    return this.db.collection("users");
  }

  get diaryCollection() {
    return this.db.collection("diaries");
  }
  get diaryRecordCollection() {
    return this.db.collection("diary_records");
  }

  private getCollection<T extends CollectionType>(
    collection: T
  ): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    return this.db.collection(collection);
  }

  public signInAnonymouslyAsync = async () => {
    try {
      await this.auth.signInAnonymously();
    } catch (error) {
      throw new Error(`Function [${this.signInAnonymouslyAsync.name}] ${error}`);
    }
  };

  public setAuthStateChange(callback: any) {
    return this.auth.onAuthStateChanged(callback);
  }

  public signUpAsync = async (
    name: string,
    email: string,
    password: string,
    rememberSession: boolean = true,
    emailVerification: boolean = false
  ) => {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);

      if (userCredential != null) {
        if (userCredential.user != null) {
          await this.writeDataByDocumentIdAsync("users", userCredential.user.uid, {
            name: name,
            email: email,
          });

          if (emailVerification) {
            this.user.sendEmailVerification();
          }

          return true;
        } else {
        }
      } else {
      }
    } catch (error) {
      throw new Error(`Function [${this.signUpAsync.name}] ${error}`);
    }

    return false;
  };

  public writeDataAsync = async <T extends CollectionType>(collection: T, data: any) => {
    const col = this.getCollection(collection);
    const docRef = col.doc();

    await docRef?.set(data, { merge: true });
  };

  public removeDataAsync = async <T extends CollectionType>(collection: T, documentId: string) => {
    const docRef = this.getDocument(collection, documentId);
    return await docRef.delete();
  };

  public writeDataByDocumentIdAsync = async <T extends CollectionType>(
    collection: T,
    documentId: string,
    data: any
  ) => {
    const col = this.getCollection(collection);
    const docRef = col.doc(documentId);
    await docRef?.set(data, { merge: true });
  };

  public getDataWithFilterAsync = async <T extends CollectionType>(
    collection: T,
    field: string,
    operator: WhereFilterOp,
    value: any
  ) => {
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

  public getDatasWithFilterAsync = async <T extends CollectionType>(
    collection: T,
    field: string,
    operator: WhereFilterOp,
    value: any
  ) => {
    const query = this.createQuery(collection, field, operator, value);
    return await query.get();
  };

  public createQuery = <T extends CollectionType>(
    collection: T,
    field: string,
    operator: WhereFilterOp,
    value: any
  ) => {
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

  public loginAsync = async (email: string, password: string, rememberSession: boolean = false) => {
    let ret = false;
    try {
      ret = (await this.auth?.signInWithEmailAndPassword(email, password)) != null;
    } catch (error) {
      throw new Error(`Function [${this.loginAsync.name}] ${error}`);
    }

    return ret;
  };

  public signOut = () => this.auth.signOut();

  public sendEmailVerification = () => {
    try {
      this.user.sendEmailVerification();
    } catch (error) {
      throw new Error(error);
    }
  };

  public passwordUpdate = (password: string) => {
    try {
      this.user.updatePassword(password);
    } catch (error) {
      throw new Error(error);
    }
  };

  /*
  signInWithGoogle = () => this._auth?.signInWithPopup(this._googleProvider)

  signInWithFacebook = () => this._auth?.signInWithPopup(this._facebookProvider)

  signInWithTwitter = () => this._auth?.signInWithPopup(this._twitterProvider)

  signInWithGithub = () => this._auth?.signInWithPopup(this._githubProvider)
*/
}

export default Firebase;
