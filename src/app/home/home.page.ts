import { ApplicationRef, Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  constructor( public pushService: PushService, public applicationRef: ApplicationRef) {
    // code
  }

  ngOnInit(): void {
      this.pushService.pushListener.subscribe( _noti => {
        this.mensajes.unshift( _noti );
        this.applicationRef.tick();
      });

  }

  async ionViewWillEnter(){
    this.mensajes = await this.pushService.getMensajes();
  }

}
