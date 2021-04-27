import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';

const httpOptions = {
  headers: new HttpHeaders({
    'x-pagina_num': '1',
    'x-pagina_tamanio': '10'
  })
};


@Injectable({
  providedIn: 'root'
})
export class ResourseService<T extends Resource>{

  

  constructor(
    private http: HttpClient,
    private notifier: NotifierService
  ) { }

  create = (endpoint: string, item: T): Promise<T> => this.http.post<T>(`${environment.API_URL}/${endpoint}`, item).toPromise()

  read = (endpoint: string, id: number): Promise<T> => this.http.get<T>(`${environment.API_URL}/${endpoint}/${id}`).toPromise()

  list = (endpoint: string, queryOptions: string = ''): Promise<T> => this.http.get<T>(`${environment.API_URL}/${endpoint}/${queryOptions}`, httpOptions ).toPromise()
  
  update = (endpoint: string, item: T, id: number): Promise<T> => this.http.put<T>(`${environment.API_URL}/${endpoint}/${id}`, item).toPromise()

  delete = (endpoint: string, id: number): Promise<T> => this.http.patch<T>(`${environment.API_URL}/${endpoint}/${id}`, id).toPromise()

  //list = (endpoint: string, queryOptions: string = ''): Promise<T> => this.http.get<T>(`${environment.API_URL}/${endpoint}/${queryOptions}`).toPromise()

  makeRequest = (request: any, showMessage: boolean = true) => request.then(async (r: any) => (await this.checkSuccessfullRequest(await r, showMessage))
  ).catch((err: any) => {
    this.notifier.notify('error', `Ha ocucurrido un error en la petición: ${err.name}`)
    return []
  })

  checkSuccessfullRequest = async (requestData, showMessage:boolean) => {
    return ['OK', 'SI'].includes(await requestData.statusText) ?
      (showMessage ? this.notifier.notify('success', requestData.notificaciones) : '', await requestData.data) :
      (this.notifier.notify('error', requestData.notificaciones), [])
  }

}