import { FormElement } from '../../formElement.model';

export class TextArea extends FormElement<string>{
    controlType = 'textArea'
    type: string
    maxLength: number
    minLength: number

  
    constructor(options: {} = {}) {
      super(options)
      this.type = options['type'] || ''
      this.maxLength = options['maxLength'] || 100
      this.minLength = options['minLength'] || 3
    }
}