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
export class AnexoService {
    urlAPI: string;
    dataUser: string;
    constructor(private http: HttpClient,
        private store: NgForage, ) {
        // Dependiendo del tipo de deploy apuntar a productivo o a calidad
        this.urlAPI = environment.API_URL;
    }


    Get(tam: number, pag: number) {
        const headers = {
            headers: new HttpHeaders({
                'x-pagina_num': pag.toString(),
                'x-pagina_tamanio': tam.toString()
            })
        };
        return this.http.get(this.urlAPI + "Menu", headers);
    }

    postAnexo(body){
        console.log(body);
        return this.http.post(this.urlAPI + "TipoArchivo", body);
    }
    



}