import { Component ,ViewChild, ElementRef } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams,ViewController,ModalController, Platform } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Chart } from 'chart.js';
//import { DatePicker } from 'ionic2-date-picker';
import { DatePicker } from '@ionic-native/date-picker';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { SetupPage } from '../setup/setup';
import { Storage } from '@ionic/storage';
import { TempHumidityPage } from './dashpages/tempHum';
import { CO2VOCPage } from './dashpages/co2voc';
import { PressureUVPage } from './dashpages/pressureUV';
import { IRLightPage } from './dashpages/IRLight';

import { DataProvider } from '../../providers/data-service/data-service';
import * as _ from 'lodash';
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers:[ DatePicker ]
})
export class DashboardPage {
  @ViewChild(Nav) nav: Nav;

  start:Date;
  end:Date;
  rootPage: any = DashboardPage;

  dashpages: Array<{title: string, icon:string, component: any}>;


  constructor(public dataProvider:DataProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private datePicker: DatePicker,
    public viewController:ViewController,
    public modalCtrl: ModalController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userServiceProvider:UserServiceProvider,
    public sensorData: Storage,
    public platform: Platform, 
) {

    let toaststart = this.toastCtrl.create({
      message: 'WARNING: Some of your sensors went offline :/ You can still access historical data, but you will like to contiune to receive the most current data, please go to settings and reconfigure your nodes. Please tap settings to resolve this issue.',
      showCloseButton: true,
      closeButtonText: 'Setup'
    });

    this.dashpages = [
        { title: 'Temperate & Humidity', icon:'thermometer', component: TempHumidityPage },
        { title: 'Carbon Dioxide & VOCs', icon:'warning',component: CO2VOCPage },
        { title: 'Pressure & UV', icon: 'sunny', component: PressureUVPage},
        { title: 'IR & Light', icon:'contrast',component: IRLightPage },
      ];
  }

//hardcoded start/end data
  getData() {
    console.log(this.start);
    console.log(this.end);
  }

  dismissHandler() {
    console.info('Toast onDidDismiss()');
    //this.nav.setRoot(SetupPage);
  }


  openPage(page) {
   this.navCtrl.push(page.component);
   //push pages cause you want to go back to dash from them
    }

  storeSensorData(){
      //store sensor data locally so can be referenced by other pages
      //without needing to ping again
     this.dataProvider.chartdata("","").subscribe(
        
              data => {
                var fakeData = 
        
                {
                    "success": true,
                    "size": 1,
                    "data": [
                    {
                     "_id": "59e171fe92f5dc00047f3dbe",
                     "datetime": "2017-10-14T02:10:06.587Z",
                     "temperature": 23.6,
                     "humidity": 61.07,
                     "co2": 679,
                     "voc": 42,
                     "visible": 261,
                     "light": 3,
                     "UV": 0.01,
                     "IR": 255,
                     "pressure": 99539,
                     "nodeID": "00000012340987011",
                     "__v": 0
                    },
                    {
                        "_id": "59e171fe92f5dc00047f3dbf",
                        "datetime": "2017-10-15T02:10:06.587Z",
                        "temperature": 43.6,
                        "humidity": 71.07,
                        "co2": 879,
                        "voc": 12,
                        "visible": 241,
                        "light": 2,
                        "UV": 0.02,
                        "IR": 245,
                        "pressure": 99639,
                        "nodeID": "00000012340987011",
                        "__v": 0
                       },
                       {
                        "_id": "59e171fe92f5dc00047f3dbg",
                        "datetime": "2017-11-14T02:10:06.587Z",
                        "temperature": 25.6,
                        "humidity": 90.07,
                        "co2": 779,
                        "voc": 32,
                        "visible": 271,
                        "light": 3,
                        "UV": 0.01,
                        "IR": 155,
                        "pressure": 89539,
                        "nodeID": "00000012340987011",
                        "__v": 0
                       },
                       {
                        "_id": "59e171fe92f5dc00047f3dbr",
                        "datetime": "2017-11-16T02:10:06.587Z",
                        "temperature": 29.6,
                        "humidity": 69.07,
                        "co2": 629,
                        "voc": 32,
                        "visible": 221,
                        "light": 2,
                        "UV": 0.03,
                        "IR": 285,
                        "pressure": 98539,
                        "nodeID": "00000012340987011",
                        "__v": 0
                       },
                       {
                        "_id": "59e171fe92f5dc00047f3dbl",
                        "datetime": "2017-11-24T02:10:06.587Z",
                        "temperature": 27.6,
                        "humidity": 91.07,
                        "co2": 779,
                        "voc": 32,
                        "visible": 461,
                        "light": 2,
                        "UV": 0.02,
                        "IR": 290,
                        "pressure": 99839,
                        "nodeID": "00000012340987011",
                        "__v": 0
                       }
                    ]
                   }
                  // store the data
                   this.sensorData.set("lastcall", fakeData);
                })
            };


  clock() {

    let toaststart = this.toastCtrl.create({
      message: 'Please select start date/time', position: 'middle'
    });
    //toaststart.present();



    // Start date and time selector
    this.datePicker.show({
        date: new Date(),
        mode: 'datetime',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
        date => {
          this.start = date;
          var self = this;
          setTimeout(function() {
            // End date and time selector
            self.datePicker.show({
                date: new Date(),
                mode: 'datetime',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then(
                date => {
                  self.end = date;
                  self.getData();
                },
                err => console.log('', err)
            );
          }, 1000)
        },
        err => console.log('', err)
    );

  }


  /* Data looks like this

{
 "success": true,
 "size": 1,
 "data": [
 {
  "_id": "59e171fe92f5dc00047f3dbe",
  "datetime": "2017-10-14T02:10:06.587Z",
  "temperature": 23.6,
  "humidity": 61.07,
  "co2": 679,
  "voc": 42,
  "visible": 261,
  "light": 3,
  "UV": 0.01,
  "IR": 255,
  "pressure": 99539,
  "nodeID": "00000012340987011",
  "__v": 0
 }
 ]
}

    */

  ionViewDidLoad() {
    this.storeSensorData();
    console.log("Data refreshed");
    //store data when dash loads
  }

  test() {
    var token = this.userServiceProvider.getToken().then((token) => {
      console.log(token);
    });
  }

}
