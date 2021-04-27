import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TramitesComponent } from './tramites/tramites.component';

const routes: Routes = [
  { path: 'tramites', component: TramitesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramitesRoutingModule { }
