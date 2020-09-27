import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreenOriginal } from '@ionic-native/splash-screen/ngx';
import { StatusBarOriginal } from '@ionic-native/status-bar/ngx';

import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { FeedPage } from '../pages/feed/feed';
import { CommentsPage } from '../pages/comments/comments';


// import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { Camera } from "@ionic-native/camera/ngx";
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireModule } from '@angular/fire';

var config = {
  apiKey: "AIzaSyCI0Y3wPkXnucYOH0wUBN1kev7PhFRzy3Y",
  authDomain: "enkichat-5f9cf.firebaseapp.com",
  databaseURL: "https://enkichat-5f9cf.firebaseio.com",
  projectId: "enkichat-5f9cf",
  storageBucket: "enkichat-5f9cf.appspot.com",
  messagingSenderId: "611262924238",
  appId: "1:611262924238:web:8880eb5243e4b1be69579f",
  measurementId: "G-8PX4J8CJ85"
};
// firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage,
    CommentsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage,
    CommentsPage
  ],
  providers: [
    StatusBarOriginal,
    SplashScreenOriginal,
    Firebase,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
