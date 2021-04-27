import { FormElement } from '../../formElement.model';

export class TextBox extends FormElement<string>{
    controlType = 'input'
    type: string
    maxValue: number
    minValue: number
    maxLength: number
    minLength: number

    constructor(options: {} = {}) {
      super(options)
      this.type = options['type'] || ''
      this.maxValue = options['maxValue'] || 999
      this.minValue = options['minValue'] || 0
      this.maxLength = options['maxLength'] || 100
      this.minLength = options['minLength'] || 3
    }
}