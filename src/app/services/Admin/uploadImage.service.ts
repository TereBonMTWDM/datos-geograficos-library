import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, map, tap, last } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class uploadService {
    urlImage: string;
    constructor(private http: HttpClient) {
        this.urlImage = environment.ApiAmazon;
    }

    uploadImage(item, bucket) {
        const headers = {
            headers: new HttpHeaders({
                'x-bucket': '' + bucket + ''
            })
        };
        //return this.http.post(this.urlImage + "Imagen", item, { reportProgress: true, headers});
        return this.http.post(this.urlImage + "Imagen", item, {
            reportProgress: true, observe: 'events', headers: new HttpHeaders(
                { 'x-bucket': '' + bucket + '' },
            )
        }).pipe(
            map((event) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        const progress = Math.round(100 * event.loaded / event.total);
                        return { progreso: progress };

                    case HttpEventType.Response:
                        return event.body;

                    default:
                        return '';
                }
            })
        );

    }
    uploadImageX64(item, bucket) {
        return this.http.post(this.urlImage + "Imagen", item, {
            reportProgress: true, observe: 'events', headers: new HttpHeaders(
                { 'x-bucket': '' + bucket + '', 'x-nube': "AWS", 'Content-Type': 'application/json'},
            )
        }).pipe(
            map((event) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        const progress = Math.round(100 * event.loaded / event.total);
                        return { progreso: progress };

                    case HttpEventType.Response:
                        return event.body;

                    default:
                        return '';
                }
            })
        );

    }


    /** Return distinct message for sent, upload progress, & response events */
    private getEventMessage(event: HttpEvent<any>, file: File) {
        switch (event.type) {
            case HttpEventType.Sent:
                return `Subiendo archivo "${file.name}" de tamaño ${file.size}.`;

            case HttpEventType.UploadProgress:
                // Compute and show the % done:
                const percentDone = Math.round(100 * event.loaded / event.total);
                return `El porcentaje "${file.name}" de subida es ${percentDone}% .`;

            case HttpEventType.Response:
                return `El archivo "${file.name}" ha sido subido correctamente!`;

            default:
                return `Algo Ocurrio${event.type}.`;
        }
    }



  
}