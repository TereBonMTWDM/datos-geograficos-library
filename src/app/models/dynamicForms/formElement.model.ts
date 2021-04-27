export abstract class FormElement<T> {
  value: T
  key: string
  title: string
  placeholder: string
  validators: {}
  controlType: string
  maxLength:Number
  minValue: Number
  type: string
  maxValue:Number
  accept:string
  minLength: Number
  maxDate
  minDate
  startView
  startDate
  options



  constructor(options: {
    value?: T,
    key?: string,
    title?: string,
    placeholder?: string,
    validators?: {},
    controlType?: string
  } = {}) {
    this.value = options.value
    this.key = options.key || ''
    this.title = options.title || ''
    this.placeholder = options.placeholder || ''
    this.validators = options.validators || {}
    this.controlType = options.controlType || ''
  }
}