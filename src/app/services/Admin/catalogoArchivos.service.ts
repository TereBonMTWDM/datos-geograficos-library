import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { NotifierService } from 'angular-notifier';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { NgForage } from 'ngforage';

const headersPaginado = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': '10'
    })
};
const headersById = {
    headers: new HttpHeaders({
        'x-menu_id': ''
    })
};



@Injectable({
    providedIn: 'root'
})
export class catalogoArchivosService {
    urlAPI: string;
    dataUser: string;
    constructor(private http: HttpClient,
        private store: NgForage, ) {
        // Dependiendo del tipo de deploy apuntar a productivo o a calidad
        this.urlAPI = environment.API_URL;
    }


    getCatalogo(tam: number, pag: number) {
        const headers = {
            headers: new HttpHeaders({
                'x-pagina_num': pag.toString(),
                'x-pagina_tamanio': tam.toString()
            })
        };
        return this.http.get(this.urlAPI + "TipoArchivo", headers);
    }

    postAnexo(body) {
        return this.http.post(this.urlAPI + "TipoArchivo", body);
    }

    getMenusActual(url) {
        const headersMenuActual = {
            headers: new HttpHeaders({
                'x-menu_href': url
            })
        };
        return this.http.get(this.urlAPI + "Menu", headersMenuActual);
    }

    deleteArchivo(idArchivo, dataUser) {
        const headersBorrado = {
            headers: new HttpHeaders({
                'x-tipoarchivo_id': "" + idArchivo + "",
                'x-usuario_id': "" + dataUser + "",
                'Content-Type': "application/json"
            })
        };
        return this.http.delete(this.urlAPI + "TipoArchivo", headersBorrado);
    }

    postData(data) {
        return this.http.post(this.urlAPI + "TipoArchivo", data);
    }

    putData(data,tipo) {
        const headerPutData = {
            headers: new HttpHeaders({
                'x-tipoarchivo_id': "" + tipo+""
            })
        };
        return this.http.put(this.urlAPI + "TipoArchivo", data,headerPutData);
    }




    





}