import { Component } from '@angular/core';
import { NavParams, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupPage {

  name: string = "";
  email: string = "";
  password: string = "";

  constructor(public router: Router, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController) {
  }

  signup() {
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then((data) => {

        console.log(data)

        let newUser: firebase.User = data.user;
        newUser.updateProfile({
          displayName: this.name,
          photoURL: ""
        }).then(() => {
          console.log("Profile Updated")

          this.alertCtrl.create({
            header: "Account Created",
            message: "Your account has been created successfully.",
            buttons: [
              {
                text: "OK",
                handler: () => {
                  //Navigate to the feeds page
                  this.router.navigateByUrl('/tabs1/feed')
                }
              }
            ]
          })

        }).catch((err) => {
          console.log(err)
        })

      }).catch((err) => {
        console.log(err)
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        })
      })
  }

  goBack() {
    this.router.navigate(['/login'])
  }

}
