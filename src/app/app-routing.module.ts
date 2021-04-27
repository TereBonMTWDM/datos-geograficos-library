import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EnConstruccionComponent } from './components/en-construccion/en-construccion.component';
import { SteperTramitesComponent } from './modules/Admin/steper-tramites/steper-tramites.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { AccesoGuard as AuthGuard } from './modules/shared/guards/acceso.guard';
import { inCitas as inCitas } from './modules/shared/guards/inCitas.guard';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { ListadoMenusComponent } from './modules/Admin/Menus/listado-menus/listado-menus.component';
import { ListadoUsuariosComponent } from './modules/Admin/Usuarios/listado-usuarios/listado-usuarios.component';
import { RolListComponent } from './modules/Admin/RolModule/rol-list/rol-list.component';
import { RolModuleComponent } from './modules/Admin/RolModule/rol-module/rol-module.component';
import { SiteMapComponent } from './components/site-map/site-map.component';
import { RolesGuard as RolGuard, RolesGuard } from './modules/shared/guards/roles.guard';
import { UsuarioModuleComponent } from './modules/Admin/UsuarioModule/usuario-module/usuario-module.component';
import { ImagenesModuleComponent } from './modules/ImagenesModule/imagenes-module/imagenes-module.component';
import { ArchivosListComponent } from './modules/Admin/CatalogoArchivos/archivos-list/archivos-list.component';
import { TestDomicilioComponent } from './components/test-domicilio/test-domicilio.component';
import { TestAutocompleteComponent } from './components/test-autocomplete/test-autocomplete.component'
import { TestCurpComponent } from './components/test-curp/test-curp.component';



const routes: Routes = [
  { path: 'catalogo', loadChildren: () => import('./modules/crud/crud.module').then(m => m.CrudModule), canActivate: [AuthGuard], data: { url: 'catalogo' } },
  { path: 'not-found', component: NotFoundComponent },
  { path: '', component: HomePageComponent, canActivate: [inCitas] },
  { path: 'login', component: LoginComponent, canActivate: [inCitas] },
  { path: 'tramites', loadChildren: () => import('./modules/tramites/tramites.module').then(m => m.TramitesModule), canActivate: [AuthGuard], data: { url: 'tramites' } },
  { path: 'registroUsuario', component: RegistroUsuarioComponent, canActivate: [AuthGuard], data: { url: 'registroUsuario' }},
  { path: 'admin/tramites', component: SteperTramitesComponent, canActivate: [AuthGuard], data: { url: 'admin/tramites' } },
  { path: 'admin/listadoMenus', component: ListadoMenusComponent, canActivate: [RolesGuard], data: { url: 'admin/listadoMenus' } },
  { path: 'admin/listadoRoles', component: RolModuleComponent, canActivate: [RolesGuard], data: { url: 'admin/listadoRoles' } },
  { path: 'admin/listadoUsuarios', component: UsuarioModuleComponent, canActivate: [RolesGuard], data: { url: 'admin/listadoUsuarios' } },
  { path: 'admin/imagenes', component: ImagenesModuleComponent, canActivate: [AuthGuard], data: { url: 'admin/imagenes' } },
  { path: 'admin/catalogoArchivos', component: ArchivosListComponent, canActivate: [RolesGuard], data: { url: 'admin/catalogoArchivos' } },
  //{ path: 'admin/listadoUsuarios', component: UsuarioModuleComponent, canActivate: [RolGuard], data: { url: 'admin/listadoUsuarios' } },
  // { path: 'admin/listadoUsuarios', component: ListadoUsuariosComponent, canActivate: [RolGuard], data: { url: 'en-construccion' } },
  { path: 'en-construccion', component: EnConstruccionComponent },
  { path: 'siteMap', component: SiteMapComponent },

  { path: 'test', component: TestDomicilioComponent, canActivate: [AuthGuard], data: { url: 'test' }},

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
