import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, ɵHttpInterceptingHandler } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from 'src/app/models/UsuarioModel';


const headersFilter = {
  headers: new HttpHeaders({ 
    'x-usuario_apellido1':'',
    'x-usuario_apellido2':''   
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  urlApi: string;
  urlAPI: string;
  dataUser: string;
  




  constructor(
    private http: HttpClient    
  ) { 
    this.urlApi = environment.API_URL + 'Usuario';
    this.urlAPI = environment.API_URL;
  }


  Get(tam: number, pag: number){
    const headers = {
      headers: new HttpHeaders({
        'x-pagina_num': pag.toString(),
        'x-pagina_tamanio': tam.toString()
      })
    };
    return this.http.get(this.urlApi, headers);
  }


  // Get(){
  //   const headers = {
  //     headers: new HttpHeaders({
  //       'x-pagina_num': '1',
  //       'x-pagina_tamanio': '10'
  //     })
  //   };
  //   return this.http.get(this.urlApi, headers);
  // }

  GetPage(numPage){
    const headers = {
      headers: new HttpHeaders({
        'x-pagina_num': numPage.toString(),
      })
    };
    return this.http.get(this.urlApi, headers);
  }

  GetSize(sizePage){
    const headers = {
      headers: new HttpHeaders({
        'x-pagina_tamanio': sizePage.toString(),
      })
    };
    return this.http.get(this.urlApi, headers);
  }


  GetAll(){   
    return this.http.get(this.urlApi);
  }

  getDataPerfil(idUsuario){
    const headersGetPerfil = {
      headers: new HttpHeaders({
        'x-usuario_id': "" + idUsuario + "",
        'x-usuario_perfil': "1"
      })
    };
    return this.http.get(this.urlAPI + "Usuario", headersGetPerfil);
  }



  GetByCorreo(correo: string) {
    const headers = {
      headers: new HttpHeaders({
          'x-usuario_correo': correo.toString()
      })
    };

    return this.http.get(this.urlApi, headers);
  }

  savePerfil(formPerfil,idUsuario) {
    const headersByPerfil = {
      headers: new HttpHeaders({
        'x-usuario_id': "" + idUsuario + "",
        'Content-Type': 'application/json'
      })
    };
    // console.log("UsuariosService -> savePerfil -> formPerfil", formPerfil)
    // console.log("UsuariosService -> savePerfil -> idUsuario", idUsuario)
    // console.log("UsuariosService -> savePerfil -> headersByPerfil", headersByPerfil)
    return this.http.put(this.urlAPI + "Usuario", formPerfil, headersByPerfil);
  }



  GetByFilter(usuario: UsuarioModel){
    const header = {
      headers: new HttpHeaders({
        'x-usuario_apellido1': usuario.apellido1.toString(),
        'x-usuario_apellido2': usuario.apellido2.toString(),
        'x-usuario_nombre': usuario.nombre.toString(),
        'x-usuario_rfc': usuario.rfc.toString(),
        'x-usuario_curp': usuario.curp.toString(),
        'x-usuario_movil': usuario.celular.toString()
      })
    }

    return this.http.get(this.urlApi, header);

    // headersFilter.headers = headersFilter.headers.set('x-usuario_apellido1', apellido1.toString());
  }


  GetNoContribuyentes(){
    const header = {
      headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': '100',
        'x-usuario_contribuyentes': '0'
      })
    }

    return this.http.get(this.urlApi, header);

    // headersFilter.headers = headersFilter.headers.set('x-usuario_apellido1', apellido1.toString());
  }



  GetRolesByUsuario(idUsuario: number){
    const header = {
      headers: new HttpHeaders({
        'x-usuario_id': idUsuario.toString(),
      })
    }

    return this.http.get(this.urlApi, header);
  }



  Update(obj: UsuarioModel){
      const header = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    return this.http.post(this.urlApi, obj, header);
  }
}
