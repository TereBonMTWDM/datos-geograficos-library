import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatosGeograficosService {
  urlApiGeograficos: string;

  constructor(
    private http: HttpClient
  ) { 
    //this.urlApiGeograficos = 'http://172.31.184.162/geograficos/v1/';
    this.urlApiGeograficos = 'https://didsqa.guanajuato.gob.mx/geograficos/v1/';
  }

  get(entidad: string, estado: string = null, municipio: string = null, colonia: string = null, localidad: string = null, cp: string = null): Observable<any> {  
    var url = this.urlApiGeograficos + entidad;
    var headersEM;
    var headersEMC;
    var headersLOC;
    var headers;
    
    //console.log(entidad, estado, municipio, colonia, localidad);
    
    if(!!localidad){
      headersLOC = {
        headers: new HttpHeaders({
          'x-estado_id': estado != null ? estado.toString() : '',
          'x-municipio_id': municipio != null ? municipio.toString() : '',
          'x-localidad_id': localidad != null ? localidad.toString() : ''
        })
      };
      headers = headersLOC;
    }
    else if(entidad == 'CP' && !!cp){        
        headersEM = {
          headers: new HttpHeaders({
            'x-cp_id': cp != null ? cp.toString() : ''            
          })
        };
        headers = headersEM;

        return this.http.get(url, headers).pipe(
          map((result: any) => 
            result.data.map((item: any) => ({
            estado: item.entidad,
            estadoId: item.entidadID,
            municipio: item.municipio,
            municipioId: item.municipioID,
            colonia: item.asentamiento,
            coloniaId: item.asentamientoID
          }))
        ));
      }
    else{
      if(entidad == 'CP' && colonia == null){
        headersEM = {
          headers: new HttpHeaders({
            'x-estado_id': estado != null ? estado.toString() : '',
            'x-municipio_id': municipio != null ? municipio.toString() : ''        
          })
        };
        headers = headersEM;
      }
      else {
        headersEMC = {
          headers: new HttpHeaders({
            'x-estado_id': estado != null ? estado.toString() : '',
            'x-municipio_id': municipio != null ? municipio.toString() : '',
            'x-colonia_id': colonia != null ? colonia.toString() : ''
          })
        };
        headers = headersEMC;
      }      
    }
  
    /*
    this.http.get(url, headers).subscribe(result => {
      console.log(result);
    });
    */


    return this.http.get(url, headers).pipe(
      map((result: any) => 
        result.data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre        
      }))
    ));
  }



    /*
  get_2(entidad: string): Observable<any> {
    console.log("DatosGeograficosService -> entidad", entidad)
      return this.http.get(this.urlApiGeograficos + entidad).pipe(
        map((result: any) => 
          result.data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre
          //item.abreviatura, item.creacion
        }))
      ));
    }
    */

    //Service anterior:
    getMunicipiosByEdo(){
      const headers = {
        headers: new HttpHeaders({
            'x-estado_id': '11'
        })
      };
      return this.http.get(this.urlApiGeograficos + 'Municipio', headers);
    }



    getByCp(cp:string){
      const headers = {
        headers: new HttpHeaders({
            'x-cp_id': cp
        })
      };
      return this.http.get(this.urlApiGeograficos + 'CP', headers);
    }


    getLocalidades(municipio:string){
      const headers = {
        headers: new HttpHeaders({
            'x-estado_id': '11',
            'x-municipio_id': municipio
        })
      };
      return this.http.get(this.urlApiGeograficos + 'Localidad', headers);
    }



    getTipoZona(municipio:string, localidad:string){
      const headers = {
        headers: new HttpHeaders({
            'x-estado_id': '11',
            'x-municipio_id': municipio,
            'x-localidad_id': localidad
        })
      };
      return this.http.get(this.urlApiGeograficos + 'Zona', headers);
    }



    getColonias(municipio:string){
      const headers = {
        headers: new HttpHeaders({
          'x-estado_id': '11',
          'x-municipio_id': municipio
        })
      };
      return this.http.get(this.urlApiGeograficos + 'Colonia', headers);
    }
  
    getCalles(municipio:string){
      const headers = {
        headers: new HttpHeaders({
          'x-estado_id': '11',
          'x-municipio_id': municipio
        })
      };
      return this.http.get(this.urlApiGeograficos + 'Calle', headers);
    }

    getCodigosPostalesByEdoMuniCol(municipio:string, colonia:string){
      const headers = {
        headers: new HttpHeaders({
            'x-estado_id': '11',
            'x-municipio_id': municipio,
            'x-colonia_id': colonia,
        })
      };
      return this.http.get(this.urlApiGeograficos + 'CP', headers);
    }

    

}
