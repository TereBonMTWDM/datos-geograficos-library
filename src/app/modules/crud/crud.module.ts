import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudRoutingModule } from './crud-routing.module';
import { ResourceComponent } from './components/resource/resource.component';
import { CrudComponent } from './pages/catalogos/crud.component';
import { ResourseService } from 'src/app/services/catalogos/resourceService/resourse.service';

import { DynamicFormService } from './../../services/base/dynamic-form.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CrudComponent,
    ResourceComponent],
  imports: [
    CommonModule,
    SharedModule,
    CrudRoutingModule
  ],
  providers: [
    ResourseService,
    DynamicFormService
  ]
})
export class CrudModule { }
