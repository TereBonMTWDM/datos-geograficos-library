import { Resource } from 'src/app/models/catalogo/resource.model';
import { FormElement } from '../dynamicForms/formElement.model';
import { TextBox } from '../dynamicForms/FormTypes/Input/textBox.model';
import { Select } from '../dynamicForms/FormTypes/select/select.model';


export class Tramite extends Resource{
    constructor(
        public id: number = 0,
        public nombre: string = '',
        public descripcion: string = '',
        public sistemaId: number = 0,
        public urlPdf: string = '',
        public accion: string = '',

        public data = []
    ){
        super()
        super.Id = id
        super.title = 'Catálogo de Trámites'
        super.status = 1 // mientras, number
    }

    buildForm(actions: string[] = ['add', 'close']) {
        const modelForm: FormElement<any>[] = [
            new TextBox({
                key: 'nombre',
                title: 'nombre',
                placeholder: 'Nombre',
                value: this.nombre, ////
                type: 'text',
                minLength: 2,
                maxLength: 150,
                validators: {
                    minLength: 2,
                    maxLength: 150,
                    required: true
                }
            }),
            new TextBox({
                key: 'descripcion',
                title: 'descripcion',
                placeholder: 'Descripcion',
                value: this.descripcion, ////
                type: 'text',
                minLength: 2,
                maxLength: 150,
                validators: {
                    minLength: 2,
                    maxLength: 150,
                    required: true
                }
            }),
            new Select({
                key: 'accion',
                title: 'Tipo General de Trámite',
                value: '' + this.accion,
                options:
                    [
                        { key: 'Alta', value: 'ALTA' },
                        { key: 'Baja', value: 'BAJA' },
                        { key: 'Cambio', value: 'CAMBIO' },
                    ],
            })
        ]
        return {
            id: this.Id,
            formData: modelForm,
            actions: actions
        }
    }
}
