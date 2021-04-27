import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CalleModel } from '../models/geograficosModel';


@Injectable({
  providedIn: 'root'
})
export class GeograficosService {
  urlApiGeograficos: string;
  constructor(
    private http: HttpClient
  ) { 
    this.urlApiGeograficos = environment.ApiDatosGeograficos;
  }

  getPaises(){
    return this.http.get(this.urlApiGeograficos + 'Pais');
  }




  getEstados(){
    return this.http.get(this.urlApiGeograficos + 'Estado');

    //return this.http.get(this.urlApiGeograficos + 'Entidad');
  }




  getMunicipiosByEdo(){
    const headers = {
      headers: new HttpHeaders({
          'x-estado_id': '11'
      })
    };
    return this.http.get(this.urlApiGeograficos + 'Municipio', headers);
  }

  getLocalidadesByEdoMuni(idEstado: string, idMuni: string){
    const headers = {
      headers: new HttpHeaders({
          'x-estado_id': ""+idEstado+"",
          'x-municipio_id': ""+idMuni+""
      })
    };
    return this.http.get(this.urlApiGeograficos + 'Localidad', headers);
  }



  getCP(idEstado: string, idMuni: string, idCol?: string){
    var headers = {};

    if(idCol != null){
      headers = {
        headers: new HttpHeaders({      
            'x-estado_id': ""+idEstado+"",
            'x-municipio_id': ""+idMuni+"",
            'x-colonia_id': ""+idCol+""
        })        
      };
    }
    else {
      headers = {
        headers: new HttpHeaders({      
            'x-estado_id': ""+idEstado+"",
            'x-municipio_id': ""+idMuni+""
        })        
      };
    }
    
    return this.http.get(this.urlApiGeograficos + 'CP', headers);
  }


  getColonias(idEstado: string, idMuni: string, cp?: string){
    var headers = {};

    if(cp != null){
      headers = {
        headers: new HttpHeaders({      
            'x-cp_id': ""+cp+""
        })        
      };
    }
    else {
      headers = {
        headers: new HttpHeaders({      
            'x-estado_id': ""+idEstado+"",
            'x-municipio_id': ""+idMuni+""
        })        
      };
    }
    
    return this.http.get(this.urlApiGeograficos + 'Colonia', headers);
  }



  getVialidades(idEstado: string, idMuni: string){
    const headers = {
      headers: new HttpHeaders({      
          'x-estado_id': ""+idEstado+"",
          'x-municipio_id': ""+idMuni+""
      })        
    };
  
    return this.http.get<CalleModel>(this.urlApiGeograficos + 'Calle', headers);
  }




}
