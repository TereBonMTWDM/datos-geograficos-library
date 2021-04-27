import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { NotifierService } from 'angular-notifier';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
const httpOptions = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': '10'
    })
};
@Injectable()
export class RegistroService {
    urlAPI: string;
    urlAPIRenapo: string;
    urlApiPaises:"https://restcountries.eu/rest/v2/all" ;

    
    

    constructor(private http: HttpClient) {
        this.urlAPI = environment.API_URL;
        this.urlAPIRenapo = environment.apiRenapo;
    }

    getPaises() {
        return this.http.get("https://restcountries.eu/rest/v2/all");
    }

    getEntidades() {
        return this.http.post("http://172.31.113.43:3000/api/sap/cat/getAll/1/46/true/null",{COLLECTION: "inegi_entidades"}); 
    }

    getRoles() {
        return this.http.get(this.urlAPI + "/Rol", httpOptions);
    }

    getDataRenapo(curp) {
        const headersRenapo = {
            headers: new HttpHeaders({
                'x-curp': '' + curp + ''
            })
        };
        return this.http.get(this.urlAPIRenapo, headersRenapo).toPromise();
    }

    getDataRenapoSub(curp) {
        const headersRenapo = {
            headers: new HttpHeaders({
                'x-curp': '' + curp + ''
            })
        };
        return this.http.get(this.urlAPIRenapo, headersRenapo);
    }



}