import { Resource } from 'src/app/models/catalogo/resource.model';
import { FormElement } from '../dynamicForms/formElement.model';
import { TextBox } from '../dynamicForms/FormTypes/Input/textBox.model';
import { DatePicker } from '../dynamicForms/FormTypes/Input/datePicker.model';
import { Select } from '../dynamicForms/FormTypes/select/select.model';

export class Rol extends Resource {
    constructor(
        public id: number = 0,
        public descripcion: string = '',
        public Status: number = 0,
        public menuID: number = 0,
        public texto: any = []


    ) {
        super()
        super.Id = id
        super.title = 'Catálogo de Roles'
        super.status = Status,
            super.statusField = 'estatus',
            super.displayedColumns = ['descripcion']
    }

    async buildForm(actions: string[] = ['add', 'close']) {
        const modelForm: FormElement<any>[] = [
            new TextBox({
                key: 'descripcion',
                title: 'Rol',
                placeholder: 'Rol',
                value: this.descripcion,
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
                 key: 'menuID',
                 title: 'texto',
                 value: this.menuID ? this.menuID : '' + '0',
                 options: this.mapToSelectKeys(await this.texto, 'menuID', 'texto')
             }),
        ]
        return {
            id: this.Id,
            formData: modelForm,
            actions: actions
        }
    }
    headers(){
        
    }
}