import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { SoloNumerosDirective } from './directives/solo-numeros.directive';
import { MaterialModule } from './modules/material/material.module';
import { FormBuilderComponent } from './components/dynamicForms/form-builder/form-builder.component';
import { FormElementComponent } from './components/dynamicForms/form-element/form-element.component';
import { SharedRoutingModule } from './shared-routing.module';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoadingComponent,
    SoloNumerosDirective,
    StatCardComponent,
    FormElementComponent,
    FormBuilderComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    FormBuilderComponent,
    FormElementComponent,
    MaterialModule
  ]
})
export class SharedModule { }
