import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AmazonService {
  urlApi: string;

  constructor(
    private http: HttpClient
  ) { 
    this.urlApi = environment.ApiAmazon;
  }


  GetImagesByList(imageList) {
    return this.http.post(this.urlApi+"Imagenes", imageList);
  }


  getImageBase64(fileName, bucket){
    const headers = {
      headers: new HttpHeaders({
        'x-nube':'AWS',
        'x-bucket': '' + bucket + '',
        'x-imagen_nombre': '' +fileName+''
      })
    };
    return this.http.get(this.urlApi + "Imagen", headers);
  }
}
