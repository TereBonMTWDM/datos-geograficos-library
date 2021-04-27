import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatGridListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, 
  MatCardModule, MatListModule, MatDatepickerModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';

//Components:
import { DatosGeograficosComponent } from './datos-geograficos.component';
import { EntidadComponent } from './entidad/entidad.component';
import { NacimientoComponent } from './nacimiento/nacimiento.component';
import { DomicilioComponent } from './domicilio/domicilio.component';
import { CurpComponent } from './curp/curp.component';
import { DomicilioMultiComponent } from './domicilio-multi/domicilio-multi.component';

import { AppSoloNumerosDirective } from './app-solo-numeros.directive';



@NgModule({
  declarations: [
    DatosGeograficosComponent, 
    EntidadComponent, NacimientoComponent, DomicilioComponent, CurpComponent, DomicilioMultiComponent, AppSoloNumerosDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    MatGridListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule,
    MatCardModule, MatListModule, MatDatepickerModule, MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  exports: [
    DatosGeograficosComponent, 
    EntidadComponent,
    NacimientoComponent,
    DomicilioComponent,
    CurpComponent,
    DomicilioMultiComponent,
    AppSoloNumerosDirective
  ]
})
export class DatosGeograficosModule { }
