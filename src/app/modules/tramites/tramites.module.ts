import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramitesRoutingModule } from './tramites-routing.module';
import { TramitesComponent } from './tramites/tramites.component';
import { TramitesSelectComponent } from './tramites-select/tramites-select.component';
import { SharedModule } from '../shared/shared.module';
import { TramitesListComponent } from './tramites-list/tramites-list.component';


@NgModule({
  declarations: [TramitesComponent, TramitesSelectComponent, TramitesListComponent],
  imports: [
    CommonModule,
    TramitesRoutingModule,
    SharedModule
  ]
})
export class TramitesModule { }
