import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { Observable, Subject, BehaviorSubject, Subscriber } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';


const headersMenuUsuario = {
  headers: new HttpHeaders({
      'x-menuusuario_id':'1',
      'x-menuusuario_fecha':'',
      'x-menuusuario_publicos':'2'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  urlAPI: string;
  dataUser: string;
  userId: string;
  constructor(private http: HttpClient,private authService: AuthService) {
    this.urlAPI = environment.API_URL;
   }

  // getHeaderParams() :Observable<{}> {
  //   if (!this.authService.usuarioLogeado) {
  //     return this.http.get('https://api.myjson.com/bins/1310fe')
  //   }else{
  //     return this.http.get('https://api.myjson.com/bins/1310fe')
  //   }
  // }

 getHeaderParams(data){
    headersMenuUsuario.headers =
      headersMenuUsuario.headers.set('x-menuusuario_id', "" + data['idx'] + "");
    headersMenuUsuario.headers =
      headersMenuUsuario.headers.set('x-menuusuario_fecha', moment(Date()).format());
      return this.http.get(this.urlAPI + "MenuUsuario", headersMenuUsuario);
  }

  getHeaderParamsNoLogeado(){
    return this.http.get(this.urlAPI + "MenuUsuario");
  }

  /* getHeaderParams() {
    return this.http.get('https://api.myjson.com/bins/1310fe');
} */


  getHeaderParamsSocial() :Observable<{}> {
    return this.http.get('assets/json/headerSocial.config.json')
  }
  
}

