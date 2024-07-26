import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../../http/http.service';
import { UserService } from '../users/user.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(
    private httpService: HttpService,
    private userService: UserService
  ) {

  }

  getTopicList(): Observable<any> { //obtiene la lista de tópicos
    const headers = {
      'Content-Type': 'application/json',
      'admin': "jairo.davila+demo@newtoms.com",
      'type': "agroseguro",
      'channel': "WEB"
    };
    return this.httpService
      .get(
        `/topics-channel`,
        undefined,
        headers
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  sendMessage(body: any): Observable<any> { //envia la pregunta realizada por el usuario y obtiene una respuesta generada por la IA
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.httpService
      .post(
        `/send-message`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  generateTicket(body: any): Observable<any> { //Envia la petición de generación de tickets
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.httpService
      .post(
        `/tickets`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  logout(){
    this.userService.logout()
  }

}
