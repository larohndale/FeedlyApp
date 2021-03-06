import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import moment from 'moment';
import { Firebase } from '@ionic-native/firebase'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginPage } from '../login/login';
import { CommentsPage } from '../comments/comments';
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string;
  userID: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private camera: Camera, private http: HttpClient, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, private modalCtrl: ModalController, private firebaseCordova: Firebase) {
    this.getPosts();
    this.userID = firebase.auth().currentUser.uid;
    this.firebaseCordova.getToken().then((token) => {
      console.log(token)

      this.updateToken(token, firebase.auth().currentUser.uid);

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

  getPosts() {

    this.posts = [];

    let loading = this.loadingCtrl.create({
      content: "Loading Feed..."
    });

    loading.present();

    let query = firebase.firestore().collection("posts").orderBy("created", "desc").limit(this.pageSize);

    query.onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();



      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
        }

        if (change.type == "modified") {
          for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == change.doc.id) {
              this.posts[i] = change.doc;
              console.log(this.posts)
            }
          }
        }

        if (change.type == "removed") {
          // TODO
        }
      })
    })

    query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        loading.dismiss();

        this.cursor = this.posts[this.posts.length - 1];

        console.log(this.posts)

      }).catch((err) => {
        console.log(err)
      })
  }

  loadMorePosts(event) {

    firebase.firestore().collection("posts").orderBy("created", "desc").startAfter(this.cursor).limit(this.pageSize).get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        console.log(this.posts)

        if (docs.size < this.pageSize) {
          // all documents have been loaded
          event.enable(false);
          this.infiniteEvent = event;
        } else {
          event.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }

      }).catch((err) => {
        console.log(err)
      })

  }

  refresh(event) {

    this.posts = [];

    this.getPosts();

    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }

    event.complete();

  }

  post() {

    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then(async (doc) => {
      console.log(doc)

      if (this.image) {
        await this.upload(doc.id)
      }

      this.text = "";
      this.image = undefined;

      this.toastCtrl.create({
        message: "Your post has been created successfully.",
        duration: 2000
      }).present();

      this.getPosts();
    }).catch((err) => {
      console.log(err)
    })

  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  logout() {

    firebase.auth().signOut().then(() => {

      this.toastCtrl.create({
        message: "You have been logged out successfully.",
        duration: 2000
      }).present();

      this.navCtrl.setRoot(LoginPage);
    });

  }

  addPhoto() {

    this.launchCamera();

  }

  launchCamera() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    }

    this.camera.getPicture(options).then((base64Image) => {
      console.log(base64Image);

      this.image = "data:image/png;base64," + base64Image;


    }).catch((err) => {
      console.log(err)
    })
  }

  async openAlert(index: number) {
    const alert = await this.alertCtrl.create({
      title: 'Sure want to delete this!!!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Delete',
          cssClass: 'secondary',
          handler: () => {
            this.delete(index);
          }
        }, {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel');

          }
        }
      ]
    });

    await alert.present();
  }

  upload(name: string) {

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      })

      loading.present();

      let ref = firebase.storage().ref("postImages/" + name);

      let uploadTask = ref.putString(this.image.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loading.setContent("Uploaded " + percentage + "% ...")

      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!");


        uploadTask.snapshot.ref.getDownloadURL().then((url) => {

          firebase.firestore().collection("posts").doc(name).update({
            image: url
          }).then(() => {
            loading.dismiss()
            resolve()
          }).catch((err) => {
            loading.dismiss()
            reject()
          })

        }).catch((err) => {
          loading.dismiss()
          reject()
        })

      })

    })

  }

  like(post) {

    let body = {
      postId: post.id,
      userId: firebase.auth().currentUser.uid,
      action: post.data().likes && post.data().likes[firebase.auth().currentUser.uid] == true ? "unlike" : "like"
    }

    let toast = this.toastCtrl.create({
      message: "Updating like... Please wait."
    });

    toast.present();


    this.http.post("https://us-central1-enkichat-5f9cf.cloudfunctions.net/updateLikesCount", JSON.stringify(body), {
      responseType: "text"
    }).subscribe((data) => {
      console.log(data)

      toast.setMessage("Like updated!");
      setTimeout(() => {
        toast.dismiss();
      }, 1500)
    }, (error) => {
      // toast.setMessage("An error has occured. Please try again later.")
      // setTimeout(() => {
      //   toast.dismiss();
      // }, 1500)
      console.log(error)
    })

  }

  comment(post) {

    this.actionSheetCtrl.create({
      buttons: [
        {
          text: "View All Comments",
          handler: () => {
            this.modalCtrl.create(CommentsPage, {
              "post": post
            }).present();
          }
        },
        {
          text: "New Comment",
          handler: () => {

            this.alertCtrl.create({
              title: "New Comment",
              message: "Type your comment",
              inputs: [
                {
                  name: "comment",
                  type: "text"
                }
              ],
              buttons: [
                {
                  text: "Cancel"
                },
                {
                  text: "Post",
                  handler: (data) => {

                    if (data.comment) {

                      firebase.firestore().collection("comments").add({
                        text: data.comment,
                        post: post.id,
                        owner: firebase.auth().currentUser.uid,
                        owner_name: firebase.auth().currentUser.displayName,
                        created: firebase.firestore.FieldValue.serverTimestamp()
                      }).then((doc) => {
                        this.toastCtrl.create({
                          message: "Comment posted successfully.",
                          duration: 3000
                        }).present();
                      }).catch((err) => {
                        this.toastCtrl.create({
                          message: err.message,
                          duration: 3000
                        }).present();
                      })

                    }

                  }
                }
              ]
            }).present();

          }
        }
      ]
    }).present();

  }

  async delete(post) {
    if (firebase.auth().currentUser.uid === post.data().owner) {
      let _post = firebase.firestore().collection('posts');
      try {
        await _post.doc(post.id).delete();
        this.toastCtrl.create({
          message: 'Deleted',
          duration: 2100
        }).present();
        this.getPosts();
      }
      catch (err) {
        this.toastCtrl.create({
          message: err.message,
          duration: 2100
        }).present();
      }
    }
  }

}
