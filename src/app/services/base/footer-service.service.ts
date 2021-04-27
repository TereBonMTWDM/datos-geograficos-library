import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FooterServiceService {

  constructor(private http:HttpClient) { }

  async getFooterConfiguration():Promise<{}>{
    return this.http.get('assets/json/footer.config.json').toPromise()
  }
}
