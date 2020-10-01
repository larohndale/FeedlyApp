import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage {

  email: string = "";
  password: string = "";

  constructor(public router: Router, public toastCtrl: ToastController) {

  }

  login() {

    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then((user) => {
        console.log(user)

        this.toastCtrl.create({
          message: "Welcome " + user.user.displayName,
          duration: 3000
        })

        this.router.navigateByUrl('/tabs1/feed')

      }).catch((err) => {
        console.log(err)
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        })
      })

  }

  gotoSignup() {
    this.router.navigateByUrl('/signup');
  }

}
