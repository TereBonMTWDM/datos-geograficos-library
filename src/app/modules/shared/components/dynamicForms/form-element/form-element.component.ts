import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormElement } from 'src/app/models/dynamicForms/formElement.model';

@Component({
  selector: 'dgtit-form-element',
  templateUrl: './form-element.component.html',
  styleUrls: ['./form-element.component.sass']
})
export class FormElementComponent implements OnInit {

  @Input() formElement: FormElement<any>
  @Input() form: FormGroup
  get isValid() { return this.form.controls[this.formElement.key].valid }
  get isTouched() { return this.form.controls[this.formElement.key].touched }
  
  constructor() { }

  ngOnInit() {
  }

}
