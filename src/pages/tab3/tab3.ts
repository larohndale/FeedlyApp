import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

/**
 * Generated class for the Tab3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.html',
  styleUrls: ['tab3.scss']
})
export class Tab3Page {

  constructor(public router: Router, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Tab3Page');
  }

}
