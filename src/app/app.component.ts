import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBarOriginal } from '@ionic-native/status-bar';
import { SplashScreenOriginal } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBarOriginal, splashScreen: SplashScreenOriginal) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

