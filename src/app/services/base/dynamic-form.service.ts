import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormElement } from 'src/app/models/dynamicForms/formElement.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor() { }

  toFormGroup(formElements: FormElement<any>[]): FormGroup {
    let fGroup: any = {}

    if (typeof (formElements) !== 'undefined') {
      formElements.forEach(element => {
        fGroup[element.key] = new FormControl(element.value || '', this.setValidators(element.validators))
      })
    }
    return new FormGroup(fGroup)
  }

  setValidators(validators: {}): any[] {
    let validatorsList = []
    const validatorKeys = Object.keys(validators)
    if (validatorKeys.length < 1) return []
    validatorKeys.forEach(valKey => (valKey === 'required' || valKey === 'email') ? validatorsList.push(Validators[valKey])
      : ((typeof (Validators[valKey]) === 'function') ? validatorsList.push(Validators[valKey](validators[valKey]))
        : console.error(`${valKey} no es un método válido de Validators`)))
    return validatorsList
  }
}