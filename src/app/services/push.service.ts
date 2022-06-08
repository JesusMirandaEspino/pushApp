import { Injectable } from '@angular/core';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  public mensajes: any[] = [
    {
      title: '',
      body: '',
      date: new Date()
    }
  ];

  constructor( private oneSignal: OneSignal ) { }


  configuracionInicial(){

    this.oneSignal.startInit('80829c2f-85f8-4c35-a167-1152d0b2c77c', '900385423612');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
      console.log('recibe', noti );
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log('open', noti );
    });

    this.oneSignal.endInit();

  }


}
