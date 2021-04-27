import { FormElement } from '../../formElement.model';

export class DatePicker extends FormElement<string>{
    controlType = 'datePicker'
    minDate: string
    maxDate: string
    startView: string
    startDate: Date
  
    constructor(options: {} = {}) {
      super(options)
      this.minDate = options['minDate'] || ''
      this.maxDate = options['maxDate'] || ''
      this.startView = options['startView'] || 'month'
      this.startDate = options['startDate'] || new Date()
    }
}