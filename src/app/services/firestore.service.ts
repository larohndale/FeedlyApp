import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseDatabaseModel } from '../models/base-dto.model';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase/ngx'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public userid: any;

  constructor(
    public store: AngularFirestore,
    private firebaseCordova: Firebase
  ) {
    this.firebaseCordova.getToken().then((token) => {
      console.log(token)

      this.updateToken(token, firebase.auth().currentUser.uid);
      this.userid = firebase.auth().currentUser.uid;
    }).catch((err) => {
      console.log(err)
    })
  }

  updateToken(token: string, uid: string) {

    firebase.firestore().collection("users").doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
      merge: true
    }).then(() => {
      console.log("token saved to cloud firestore");
    }).catch(err => {
      console.log(err);
    })

  }


  public create<T extends BaseDatabaseModel>(collection: string, data: T): Promise<void> {
    return this.store.doc<T>(`${collection}/${data.id}`).set(data);
  }

  public get<T extends BaseDatabaseModel>(collection: string): Observable<T[]> {
    return this.store.collection<T>(collection, ref => ref.where('uid', '==', `${this.userid}`)).valueChanges();
  }

  public getOne<T extends BaseDatabaseModel>(collection: string, id: string): Observable<T> {
    return this.store.doc<T>(`${collection}/${id}`).valueChanges();
  }

  public update<T extends BaseDatabaseModel>(collection: string, id: string, document: Partial<T>): Promise<void> {
    return this.store.doc<T>(`${collection}/${id}`).update(document);
  }

  public runQuery<T extends BaseDatabaseModel>(collection: string, query: FirestoreQuery): Observable<T[]> {
    return this.store.collection<T>(collection, ref => ref.where(query.field, query.operation, query.searchKey)).valueChanges();
  }

  public delete<T extends BaseDatabaseModel>(collection: string, id: string): Promise<any> {
    return this.store.doc<T>(`${collection}/${id}`).delete();
  }

  public uploadFile(folderName: string, downloadUrl: string, fileName: string, userImage: string): Promise<any> {
    return this.store.collection<{ downloadUrl: string; fileName: string; uid: string; userImage: string; }>(`fileReferences`).add({ downloadUrl, fileName, uid: this.userid, userImage });
  }
  public getImages(): Observable<any> {
    return this.store.collection('fileReferences', ref => ref.where('uid', '==', `${this.userid}`)).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data['id'] = a.payload.doc.id;
        return data;
      });
    }));
  }

  public getAllImages(): Observable<any> {
    return this.store.collection('fileReferences', ref => ref).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        // console.log(a.payload.doc.metadata);
        const data = a.payload.doc.data();
        data['id'] = a.payload.doc.id;
        return data;
      })
    }))
  }


  public getAllUsers(): Observable<any> {
    return this.store.collection('users', ref => ref).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data['id'] = a.payload.doc.id;
        return data;
      })
    }))
  }

}


export interface FirestoreQuery {
  field: string;
  operation: firebase.firestore.WhereFilterOp;
  searchKey: string;
}
