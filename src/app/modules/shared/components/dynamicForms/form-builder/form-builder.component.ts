import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/models/dynamicForms/formTemplate.model';
import { DynamicFormService } from 'src/app/services/base/dynamic-form.service';


@Component({
  selector: 'dgtit-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.sass']
})
export class FormBuilderComponent implements OnInit {
  @Input() formBuilderData: FormTemplate
  @Output()
  
  onSubmitedForm = new EventEmitter<Object>()


  form: FormGroup
  constructor(private dfs: DynamicFormService) { }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formBuilderData = changes.formBuilderData.currentValue
    // console.log(this.formBuilderData);
    this.form = this.dfs.toFormGroup(this.formBuilderData['formData'])
  }

  onSubmit(action: string) {
    if (!!!action || (!this.form.valid && action !== 'delete' && action !== 'close') ) return { error: 'El formulario es inválido' }
    const formResponse = {
      id: this.formBuilderData['id'] || 0,
      data: this.form.value,
      action: action
    }
    this.onSubmitedForm.emit(formResponse)
  }
}
