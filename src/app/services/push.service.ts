import { EventEmitter, Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';



@Injectable({
  providedIn: 'root'
})
export class PushService {

  public mensajes: OSNotificationPayload [] = [];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor( private oneSignal: OneSignal, private storage: Storage ) {

  }


  async getMensajes(){
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  configuracionInicial(){

    this.oneSignal.startInit('80829c2f-85f8-4c35-a167-1152d0b2c77c', '900385423612');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti: OSNotification) => {
    // do something when notification is received
    this.notificacionRecibida(noti);
      console.log('recibe', noti );
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened

      console.log('open', noti );
    });

    this.oneSignal.endInit();

  }7


  async notificacionRecibida(noti: OSNotification){
    await this.cargarMensajes();
    const payload = noti.payload;
    const existeNoti = this.mensajes.find( mensaje =>  mensaje.notificationID === payload.notificationID );
    if( existeNoti ){
      return;
    }
    this.mensajes.unshift( payload );
    this.pushListener.emit( payload );
    this.guardarMensajes();
  }


  guardarMensajes() {
      this.storage.set( 'mensajes', this.mensajes );
      console.log(this.mensajes);
    }

    async cargarMensajes(){
      this.mensajes = await this.storage.get( 'mensajes' ) || [];
    }

}
