import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HttpService } from '../../http/http.service';
import { LoginRequest } from 'src/app/shared/models/login/login-request';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { ConfigService } from '../config/config.service';

import { Router } from '@angular/router';
import { recoveryRequest } from 'src/app/shared/models/login/password-recovery-request';
import { confimrForgotPasswordRequest } from 'src/app/shared/models/login/confirm-forgot-password';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userSettings: any = null;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {

  }
//Obtener uno a uno los datos del usuario para el local storage ----
  private get userSettings(): any {
    return this._userSettings;
  }

  private set userSettings(value: any) {
    this.localStorageService.saveJSON('user_settings', value);
    this._userSettings = this.localStorageService.getJSON('user_settings');
  }

  public get email(): string {
    return this.localStorageService.getJSON('user_settings').email;
  }

  public get firstName(): string {
    return this.localStorageService.getJSON('user_settings').firstName;
  }

  public get user_data(): any {
    return this.localStorageService.getJSON('user_settings');
  }

  public get isAuthenticated(): boolean {
    let isLogged = this.localStorageService.getJSON('user_settings') ? this.localStorageService.getJSON('user_settings') : false;
    return isLogged.isLogged ? true : false;
  }

  login(body: LoginRequest):Observable<any>{
    //solicitud para el ingreso del usuario en la aplicación
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.httpService
      .post(
        `/login`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {
          let user_settings = {
            isLogged: true,
            firstName: res.user_data.first_name,
            lastName: res.user_data.last_name,
            email: res.user_data.email
          }
          this.userSettings = user_settings
          return res;
        }),
        catchError((err): any => {
          //this.errorService.HandleError(err);
        })
      );

  }

  logout(){
    //Solicitud que borra el localstorage del usuario para cerrar sesion
    this.localStorageService.clearLocalStorage();
    this.router.navigate(['/login'])
      .then(() => {
        window.location.reload();
      });;
  }

  recoveryCode(body: recoveryRequest){
    //Solicitud para el código de cambio de contraseña
    const headers = {
      'Content-Type': 'application/json',
      'no-auth': 'true',
      'no-token-refresh': 'true',

    };
    return this.httpService
      .post(
        `/forgot-password`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {

          return res;
        })
      );
  }

  passwordRecovery(body: confimrForgotPasswordRequest){
    //Solicitud para el cambio de contraseña
    const headers = {
      'Content-Type': 'application/json',
      'no-auth': 'true',
      'no-token-refresh': 'true',

    };
    return this.httpService
      .post(
        `/forgot-password`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {

          return res;
        })
      );
  }

}
