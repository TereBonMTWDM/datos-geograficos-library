import { FormElement } from '../dynamicForms/formElement.model';
import { TextBox } from '../dynamicForms/FormTypes/Input/textBox.model';
import { Select } from '../dynamicForms/FormTypes/select/select.model';
import { Resource } from './resource.model';
import { Document } from './document.model';
import { Tramite } from './tramite.model';

export class Catalogo {

    constructor() { }


    Document(resource: Document = {} as Document) {
        console.log(1);
        return new Document(resource.id, resource.nombre, resource.Status)
    }
    Tramites(resource: Tramite = {} as Tramite) {
        return new Tramite(resource.id, resource.nombre, resource.descripcion, resource.sistemaId, resource.urlPdf, resource.accion)
    }

}
