import { Injectable, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket{

  callback: EventEmitter<any> = new EventEmitter();

  constructor(
    private cookieService: CookieService
  ) {
    super({
      url: environment.workflowUrl,
      options: {
        query: {
          nameRoom: cookieService.get('dato')
        }
      }
    });
    // escucha cuando un evento desde el back es emitido -> event hace referencia a la llave
    this.ioSocket.on('event', (res: any) => this.callback.emit(res))
   }

  //  emite eventos al back -> event hace referencia a la llave con que se va a recibir
   emitEvent = (payload = {}) => {
     this.ioSocket.emit('event', payload);
   }
}
