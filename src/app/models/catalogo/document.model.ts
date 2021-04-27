import { Resource } from 'src/app/models/catalogo/resource.model';
import { FormElement } from '../dynamicForms/formElement.model';
import { TextBox } from '../dynamicForms/FormTypes/Input/textBox.model';
import { DatePicker } from '../dynamicForms/FormTypes/Input/datePicker.model';
import { Select } from '../dynamicForms/FormTypes/select/select.model';

export class Document extends Resource {
    constructor(
        public id: number = 0,
        public nombre: string = '',
        public Status: number = 0,


    ) {
        super()
        super.Id = id
        super.title = 'Catálogo de Documentos'
        super.status = Status,
        super.statusField='Status',
        super.displayedColumns=['nombre']
    }

    buildForm(actions: string[] = ['add', 'close']) {
        const modelForm: FormElement<any>[] = [
            new TextBox({
                key: 'nombre',
                title: 'Documento',
                placeholder: 'Documento',
                value: this.nombre,
                type: 'text',
                minLength: 2,
                maxLength: 150,
                validators: {
                    minLength: 2,
                    maxLength: 150,
                    required: true
                }
            })
        ]
        return {
            id: this.Id,
            formData: modelForm,
            actions: actions
        }
    }
}