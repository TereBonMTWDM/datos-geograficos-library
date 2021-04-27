import { Resource } from 'src/app/models/catalogo/resource.model';
import { ResourseService } from './../resourceService/resourse.service';
import { Injectable } from '@angular/core';
import { Document } from '../../../models/catalogo/document.model';
import { Tramite } from '../../../models/catalogo/tramite.model';
import { Rol } from '../../../models/catalogo/Rol.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private resourceService: ResourseService<Resource>
  ) {
  }

Document(resource: Document = {} as Document) {
        return new Document(resource.id, resource.nombre, resource.Status)
    }
    Tramites(resource: Tramite = {} as Tramite) {
        return new Tramite(resource.id, resource.nombre, resource.descripcion, resource.sistemaId, resource.urlPdf, resource.accion)
    }

  Rol(resource: Rol = {} as Rol) {
    return new Rol(resource.id, resource.descripcion, resource.menuID, resource.Status, this.getSubItemList('Menu'))
  }

  async getSubItemList(endpoint: string) {
    return (await this.resourceService.makeRequest(
      this.resourceService.list(endpoint),
      false
    ))
  }

}
