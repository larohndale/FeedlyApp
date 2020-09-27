import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FirestoreService } from '../services/firestore.service';

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor(
    private storage: AngularFireStorage,
    private baseFs: FirestoreService,
  ) {}

  public uploadContent(file: any, fileName: any, userImage: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (file) {
          return this.storage
            .upload(`uploads/${fileName}`, file, userImage)
            .then(
              (success) => {
                return this.storage
                  .ref(`uploads/${fileName}`)
                  .getDownloadURL()
                  .subscribe((url) => {
                    return this.baseFs
                      .uploadFile("uploads", url, fileName, userImage)
                      .then(() => {
                        resolve({ url, fileName, userImage });
                      })
                      .catch((err) => {
                        reject(err);
                      });
                  });
              },
              (failure) => {
                reject(failure);
              }
            )
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(new Error(" choice key not given"));
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
