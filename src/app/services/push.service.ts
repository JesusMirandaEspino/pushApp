import { EventEmitter, Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';



@Injectable({
  providedIn: 'root'
})
export class PushService {

  public mensajes: OSNotificationPayload [] = [];
  private _storage: Storage | null = null;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor( private oneSignal: OneSignal, private storage: Storage ) {
    this.init();
  }


    async init() {
    const storage = await this.storage.create();
    this._storage = storage;
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

    this.oneSignal.handleNotificationOpened().subscribe(async(noti) => {
      // do something when a notification is opened

      await this.notificacionRecibida( noti.notification );
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
    await this.guardarMensajes();
  }


  guardarMensajes() {
      this._storage.set( 'mensajes', this.mensajes );
      console.log(this.mensajes);
    }

    async cargarMensajes(){
      this.mensajes = await this._storage.get( 'mensajes' ) || [];
      return this.mensajes;
    }

}
