import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotifierModule } from 'angular-notifier';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DatosGeograficosModule } from 'projects/datos-geograficos/src/public-api';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from './modules/shared/modules/material/material.module';
import { SharedModule } from './modules/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccesibilidadComponent } from './components/accesibilidad/accesibilidad.component';
import { ApartadoEnlacesMenuComponent } from './components/apartado-enlaces-menu/apartado-enlaces-menu.component';
import { ApartadoEnlacesPerfilesComponent } from './components/apartado-enlaces-perfiles/apartado-enlaces-perfiles.component';
import { ApartadoFuncionesComponent } from './components/apartado-funciones/apartado-funciones.component';
import { AreaContactoComponent } from './components/area-contacto/area-contacto.component';
import { CustomSearchPanelComponent } from './components/custom-search-panel/custom-search-panel.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TransparenciaFooterComponent } from './components/transparencia-footer/transparencia-footer.component';
import { EnConstruccionComponent } from './components/en-construccion/en-construccion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SteperTramitesComponent } from './modules/Admin/steper-tramites/steper-tramites.component';
import { DocumentSelectorComponent } from './modules/Admin/document-selector/document-selector.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
//import { RolesComponent } from './modules/Admin/Roles/rolesAction/roles.component';
import { ListadoUsuariosComponent } from './modules/Admin/Usuarios/listado-usuarios/listado-usuarios.component';
import { UsuariosActionsComponent } from './modules/Admin/Usuarios/usuarios-actions/usuarios-actions.component';
import { ListadoMenusComponent } from './modules/Admin/Menus/listado-menus/listado-menus.component';
import { MenusActionsComponent } from './modules/Admin/Menus/menus-actions/menus-actions.component';
//import { ListadoRolesComponent } from './modules/Admin/Roles/listado-roles/listado-roles.component';
import { RolListComponent } from './modules/Admin/RolModule/rol-list/rol-list.component';
import { RolDialogComponent } from './modules/Admin/RolModule/rol-dialog/rol-dialog.component';
import { RolModuleComponent } from './modules/Admin/RolModule/rol-module/rol-module.component';
import { RolAsignarComponent } from './modules/Admin/RolModule/rol-asignar/rol-asignar.component';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { JwtService} from '../app/interceptors/jwt.service';
import { SiteMapComponent } from './components/site-map/site-map.component';
import { ConfirmacionComponent } from './components/confirmacion/confirmacion.component';
import { TreeViewComponent } from './components/site-map/tree-view/tree-view.component';
import { UsuarioModuleComponent } from './modules/Admin/UsuarioModule/usuario-module/usuario-module.component';
import { UsuarioListComponent } from './modules/Admin/UsuarioModule/usuario-list/usuario-list.component';
import { UsuarioDialogComponent } from './modules/Admin/UsuarioModule/usuario-dialog/usuario-dialog.component';
import { RolAsignadosComponent } from './modules/Admin/RolModule/rol-asignados/rol-asignados.component';
import { ImagenesModuleComponent } from './modules/ImagenesModule/imagenes-module/imagenes-module.component';
import { ImagenesListComponent } from './modules/ImagenesModule/imagenes-list/imagenes-list.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileUploadModule } from 'ng2-file-upload';
import { ImagenUploadComponent } from './modules/ImagenesModule/imagen-upload/imagen-upload.component';
import { DEFAULT_CONFIG, Driver, NgForageOptions } from 'ngforage';
import { ArchivosListComponent } from './modules/Admin/CatalogoArchivos/archivos-list/archivos-list.component';
import { ArchivosActionsComponent } from './modules/Admin/CatalogoArchivos/archivos-actions/archivos-actions.component';
import { MenuGrupoComponent } from './modules/Admin/MenuModule/menu-grupo/menu-grupo.component';
import { MenuAsignComponent } from './modules/Admin/MenuModule/menu-asign/menu-asign.component';
import { UsuarioGrupoComponent } from './modules/Admin/UsuarioModule/usuario-grupo/usuario-grupo.component';
import { UsuarioAsignComponent } from './modules/Admin/UsuarioModule/usuario-asign/usuario-asign.component';
import { TestDomicilioComponent } from './components/test-domicilio/test-domicilio.component';
import { TestAutocompleteComponent } from './components/test-autocomplete/test-autocomplete.component'

//directive:
import { TabDirective } from './components/test-autocomplete/tab-directive';
import { TestCurpComponent } from './components/test-curp/test-curp.component';




var config = {
  apiKey: "AIzaSyDHt2kVKxg73BCkJa1DX6yQsLwtXmSKuGw",
  authDomain: "sistemacitas-2dd20.firebaseapp.com",
  databaseURL: "https://sistemacitas-2dd20.firebaseio.com",
  projectId: "sistemacitas-2dd20",
  storageBucket: "sistemacitas-2dd20.appspot.com",
  messagingSenderId: "186744528901",
  appId: "1:186744528901:web:d11d77a1b7b2ea9249bc6c",
  measurementId: "G-XV2RTL7KLQ"
};

const ngfRootOptions: NgForageOptions = {
  name: 'citas',
  driver: [
    Driver.INDEXED_DB,
    Driver.WEB_SQL,
    Driver.LOCAL_STORAGE
  ]
};
@NgModule({
  declarations: [
    AppComponent,
    AccesibilidadComponent,
    ApartadoEnlacesMenuComponent,
    ApartadoEnlacesPerfilesComponent,
    HeaderComponent,
    AreaContactoComponent,
    FooterComponent,
    TransparenciaFooterComponent,
    NavbarComponent,
    ApartadoEnlacesMenuComponent,
    ApartadoFuncionesComponent,
    NotFoundComponent,
    EnConstruccionComponent,
    CustomSearchPanelComponent,
    SteperTramitesComponent,
    DocumentSelectorComponent,
    HomePageComponent,
    LoginComponent,
    RegistroUsuarioComponent,
    ListadoUsuariosComponent,
    UsuariosActionsComponent,
    ListadoMenusComponent,
    MenusActionsComponent,
    RolListComponent,
    RolDialogComponent,
    RolModuleComponent,
    RolAsignarComponent,
    SiteMapComponent,
    ConfirmacionComponent,
    TreeViewComponent,
    UsuarioModuleComponent,
    UsuarioListComponent,
    UsuarioDialogComponent,
    RolAsignadosComponent,
    ImagenesModuleComponent,
    ImagenesListComponent,
    ImagenUploadComponent,
    ArchivosListComponent,
    ArchivosActionsComponent,
    MenuGrupoComponent,
    MenuAsignComponent,
    UsuarioGrupoComponent,
    UsuarioAsignComponent,
    TestDomicilioComponent,
    TestAutocompleteComponent,
    TestCurpComponent,
    
  ],
  imports: [
    BrowserModule,
    PdfViewerModule,
    FileUploadModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    FormsModule,
    NotifierModule.withConfig(
      {
        position: {
          horizontal: {
            position: 'middle'
          }
        },
        behaviour: {
          autoHide: 1000
        }
      }
    ),
    DatosGeograficosModule
  ],
  entryComponents: [
    MenusActionsComponent,
    RolDialogComponent,
    ConfirmacionComponent,
    UsuarioDialogComponent,
    RegistroUsuarioComponent,
    ImagenUploadComponent,
    ArchivosActionsComponent,  
    TestDomicilioComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtService, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MatDialogRef, useValue: {} },
    {provide: MAT_DIALOG_DATA, useValue: [] },
    {provide: DEFAULT_CONFIG, useValue: ngfRootOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
