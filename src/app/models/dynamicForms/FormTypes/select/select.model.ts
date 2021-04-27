import { FormElement } from './../../formElement.model';

export class Select extends FormElement<string> {
    controlType = 'select'
    options: {key: string, value: string}[] = []
  
    constructor(options: {} = {}) {
      super(options)
      this.options = options['options'] || []
    }
  }