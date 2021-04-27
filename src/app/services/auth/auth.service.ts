import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { auth } from 'firebase/app';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { t_usuario, t_usuarioxroles } from '../../interfaces/interfaces';
import { timeout } from 'rxjs/operators';
import { NgForage } from 'ngforage';
import { map } from 'rxjs/operators';
import { Token } from '../../modules/shared/interfaces/jwt.interface';


const headersMenuUsuario = {
  headers: new HttpHeaders({
      'x-menuusuario_id':'',
      'x-menuusuario_fecha':'',
      'x-menuusuario_publicos':''
  })
};

const httpOptions = {
  headers: new HttpHeaders({
    'x-usuario_correo': ''
  })
};

const headerPerfilCompleto = {
  headers: new HttpHeaders({
    'x-usuario_correo': ''
  })
};

const httpOptionsPermiso = {
  headers: new HttpHeaders({
    'x-usuario_id': '',
    'x-usuario_href':''
  })
};

const headAdd = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-menu_id': ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlAPI: string;
  thisUrl;
  tituloPage;
  emailLF;
  idx;
  perfilCompleto;

  usuario: BehaviorSubject<any>;
  tkn: BehaviorSubject<Token>;
  accesoResponse: BehaviorSubject<any>;
  constructor(
    private http: HttpClient,
    private authFB: AngularFireAuth,
    private notifier: NotifierService,
    private router: Router,
    private store: NgForage,
  ) {
    this.urlAPI = environment.API_URL;
    this.usuario = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('usrCitas')));
    this.accesoResponse = new BehaviorSubject<any>(0);
    this.tkn = new BehaviorSubject<Token>(null);
    this.authFB.authState.subscribe((user: any) => {
      if (user) {
        this.usuario.next(JSON.parse(localStorage.getItem('usrCitas')));
      } else {
        localStorage.clear();
      }
    });
  }

  async  loginWithGoogle() {
    var provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    return await this.authFB.auth.signInWithPopup(provider)
  }

  async loginWithMicrosoft() {
    let oAuth2 = new auth.OAuthProvider('microsoft.com')
    oAuth2.setCustomParameters({ prompt: 'select_account' })
    return await this.authFB.auth.signInWithPopup(oAuth2)
  }


  async authLogin() {
    try {
      await this.loginWithGoogle()
        .then(res => {
          const usr: any = res;
          httpOptions.headers =
            httpOptions.headers.set('x-usuario_correo', res.additionalUserInfo.profile['email']);
          this.usuarioAutorizado().subscribe((respUserExist) => {
            if (respUserExist['statusCode'] == 200) {
                let userLog: Object = {
                  idx: respUserExist["data"][0]["usuarioID"],
                  email: res.additionalUserInfo.profile['email'],
                  nombre: res.additionalUserInfo.profile['given_name'],
                  picture: res.additionalUserInfo.profile['picture'],
                  apellidos: res.additionalUserInfo.profile['family_name'],
                  perfilCompleto: respUserExist["data"][0]['perfilCompletado'],
                };
              this.usuario.next(userLog);
              localStorage.setItem('usrCitas', JSON.stringify(userLog));
              this.store.setItem('usrCitas',userLog);
              if (respUserExist["data"][0]['perfilCompletado']==1){
                this.router.navigate(['/tramites']);
                this.notifier.notify('success', 'Bienvenido ' + res.additionalUserInfo.profile['given_name'] + ' ');
              }else{
                this.router.navigate(['/registroUsuario']);
                this.notifier.notify('success', 'Bienvenido ' + res.additionalUserInfo.profile['given_name'] + ', porfavor registre su información.');
              }
            } else {
              let proveedor=0;
              this.getDataUsuario(res, proveedor);
            }
          });
          //this.usuario.next(usr);
        }, err => {
            this.notifier.notify("warning", "Error al conectar con google ó la operación fue cancelada, intentelo de nuevo.");
        });
      //
    } catch (error) {
      console.log('Error al conectar con google: ', error);
      throw error;
    }
  }


  async authLoginMicrosoft() {
    try {
      await this.loginWithMicrosoft()
        .then(res => {
          //console.log(res.additionalUserInfo.profile['userPrincipalName'])
          const usr: any = res;
          httpOptions.headers =
            httpOptions.headers.set('x-usuario_correo', res.additionalUserInfo.profile['userPrincipalName']);
          this.usuarioAutorizado().subscribe((respUserExist) => {
            if (respUserExist['statusCode'] == 200) {
              
              let userLog: Object = {
                idx: respUserExist["data"][0]["usuarioID"],
                email: res.additionalUserInfo.profile['userPrincipalName'],
                nombre: res.additionalUserInfo.profile['givenName'],
                picture: "",
                apellidos: res.additionalUserInfo.profile['surname'],
                perfilCompleto: respUserExist["data"][0]['perfilCompletado'],
              };
              this.usuario.next(userLog);
              localStorage.setItem('usrCitas', JSON.stringify(userLog));
              this.store.setItem('usrCitas',userLog);
              if (respUserExist["data"][0]['perfilCompletado'] == 1) {
                this.router.navigate(['/tramites']);
                this.notifier.notify('success', 'Bienvenido ' + res.user.displayName + ' ');
              } else {
                this.router.navigate(['/registroUsuario']);
                this.notifier.notify('success', 'Bienvenido ' + res.user.displayName + ', porfavor registre su información.');
              }
            } else {
              let proveedor = 1;
              this.getDataUsuario(res, proveedor);
            }
          });
          //this.usuario.next(usr);
        }, err => {
            this.notifier.notify("error", "La ventana emergente fue cerrada antes de finalizar la operación, intentelo de nuevo.");
        });

    } catch (error) {
      console.log('Error al conectar con microsoft: ', error);
      throw error;
    }
  }


  usuarioAutorizado() {
    return this.http.get(this.urlAPI + "Usuario", httpOptions);
  }

  getPerfilCompleto() {
    return this.http.get(this.urlAPI + "Usuario", headerPerfilCompleto);
  }

  // getPerfilCompleto() {
  //   return this.http.get(this.urlAPI + "Usuario", headerPerfilCompleto).pipe(map(res => {
  //     return res['data'][0]['perfilCompletado'];
  //   }));
  // }
  usuarioPermiso(id, href) {
    const hrefVal = ('/' + href)
    httpOptionsPermiso.headers =
      httpOptionsPermiso.headers.set('x-usuario_id', "" + id + "");
    httpOptionsPermiso.headers =
      httpOptionsPermiso.headers.set('x-usuario_href', "" + hrefVal + "");
    return this.http.get(this.urlAPI + "Usuario", httpOptionsPermiso);
  }

  usuarioPermisoFromPage(href) {
    const hrefVal = ( href)
    this.usuario.subscribe((user: any) => {
      if (user !== null) {
        this.idx = user.idx
        httpOptionsPermiso.headers =
          httpOptionsPermiso.headers.set('x-usuario_id', "" + this.idx + "");
        httpOptionsPermiso.headers =
          httpOptionsPermiso.headers.set('x-usuario_href', "" + hrefVal + "");
      }
    });
    
    return this.http.get(this.urlAPI + "Usuario", httpOptionsPermiso);
  }

  watchStorage(): Observable<any> {
    return this.usuario.asObservable();
  }
  
  get usuarioLogeado(): boolean {
    let logedIn = false;
    this.usuario.subscribe((user: any) => {
      if (user !== null) {
        logedIn = true;
      }
    });
    return logedIn;
  }

  get usuarioLogeadoOnCitas(): boolean {
    let logedIn = false;
    this.usuario.subscribe((user: any) => {
      if (user !== null) {
        this.emailLF = user.email
        headerPerfilCompleto.headers =
          headerPerfilCompleto.headers.set('x-usuario_correo', this.emailLF);
        logedIn = true;
      }
    });
    return logedIn;
  }



 accesoUrl(url){
   return this.usuarioPermisoFromPage(url).toPromise();
  }

  dataLoagueado(){
    return this.usuario
  }


  async signOut() {
    await this.authFB.auth.signOut();
    await this.store.clear()

    this.router.navigate(['/']);
    this.usuario.next(null);
  }

  postUsuario(data) {
    return this.http.post(this.urlAPI + "Usuario", data, headAdd);
  }

  async getDataUsuario(res,proveedor) {
    let dataUser: Object = {
      Email: res.user.email,
      Estatus: true,
      Creador: "1",
      RolUsuario: []
    };
    this.postUsuario(dataUser).subscribe(
      resp => {
        if (proveedor==0){
          let userLog: Object = {
            idx: resp['data'][0]['usuarioID'],
            email: res.additionalUserInfo.profile['email'],
            nombre: res.additionalUserInfo.profile['given_name'],
            picture: res.additionalUserInfo.profile['picture'],
            apellidos: res.additionalUserInfo.profile['family_name'],
            perfilCompleto: 0,
          };
          this.usuario.next(userLog);
           localStorage.setItem('usrCitas', JSON.stringify(userLog));
          this.store.setItem('usrCitas', userLog);
        }else{
          let userLog: Object = {
            idx: resp['data'][0]['usuarioID'],
            email: res.additionalUserInfo.profile['userPrincipalName'],
            nombre: res.additionalUserInfo.profile['givenName'],
            picture: "",
            apellidos: res.additionalUserInfo.profile['surname'],
            perfilCompleto: 0,
          };
          this.usuario.next(userLog);
           localStorage.setItem('usrCitas', JSON.stringify(userLog));
          this.store.setItem('usrCitas',userLog);
        }
        this.notifier.notify('error', 'Alta de usuario exitosa, Favor de actualizar sus datos');
        this.router.navigate(['/registroUsuario']);
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al crear usuario'
        );
      }
    );
  };

  obtenerToken() {
    const body = new URLSearchParams();
    body.set('username', environment.T.username);
    body.set('password', environment.T.password);
    body.set('grant_type', 'password');
    body.set('client_id', environment.T.c);

    return this.http
      .post<any>(`${environment.T.urlApiAuth}oauth2/token`,
        body.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
  }
  emitirValor(tkn: Token) {
    this.tkn.next(tkn);
  }

}
