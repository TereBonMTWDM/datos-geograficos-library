import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { NotifierService } from 'angular-notifier';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class TramiteService {
    urlAPI: string;

    constructor(private http: HttpClient) {
        // Dependiendo del tipo de deploy apuntar a productivo o a calidad
        this.urlAPI = environment.API_URL;
    }

    getDocumentos() {
        return this.http.get(`${this.urlAPI}document`);
    }

    addDocument(document: any): Observable<any> {
        return this.http.post(`${this.urlAPI}document`, document);
    }
}