import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudComponent } from './pages/catalogos/crud.component';

const routes: Routes = [{ path: ':catName', component: CrudComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrudRoutingModule { }
