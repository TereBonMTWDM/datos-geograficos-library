import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';
import { NotifierService } from 'angular-notifier';
import { UsuariosService } from 'src/app/services/Admin/usuarios.service';
import { ConfirmacionComponent } from 'src/app/components/confirmacion/confirmacion.component';
import { RegistroUsuarioComponent } from 'src/app/components/registro-usuario/registro-usuario.component';
import { RolUsuarioModel } from 'src/app/models/RolModel';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<UsuarioModel>;
  @Input() totalRows: number;
  @Input('actionDialog') status: string;
  @Output() bandera = new EventEmitter<boolean>();
  
  public usuarios: UsuarioModel[];
  public usuario: UsuarioModel;
  public roles: RolUsuarioModel[] = [];
  borrar;

  displayedColumns: string[] = [
    "email",
    "nombre",
    "apellido1",
    "apellido2",
    "curp",
    "sexo",
    "rfc",
    "celular",
    "actions"
  ];

  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
    private usuarioSvc: UsuariosService,
    public dialog: MatDialog,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  }



  openDialog(action, obj) {
    obj.action = action;

    if (action == 'ASSIGN_ROLE') {
      //get Roles de Usuario
      this.usuarioSvc.GetRolesByUsuario(obj.usuarioID).subscribe( (result: UsuarioModel) => {
        if(result.statusCode == 200){
          if(result.data.length > 0){
            this.usuario = result.data[0];
              const dialogRef = this.dialog.open(UsuarioDialogComponent, {
                width: '830px', height: '720px',
                data: this.usuario
              }).afterClosed().subscribe(response => {
                if (response) {
                  if (response.success == true) {
                    //this.GetUsuarios();
                    this.banderaCambio();
                    this.notifier.notify('success', 'Usuario guardado correctamente');
                  }
                  else {
                    this.notifier.notify('error', 'Ocurrió un error al intentar guardar el Usuario');
                  }
                }
              })
          }
        }
      });
    }
    else if(action == "PROFILE") {
      //mandar a VER PERFIL
      const dialogRef = this.dialog.open(RegistroUsuarioComponent, {
        width: '1500px', height: '700px',
        data: obj.usuarioID
      })
    }

  }



  /*
  GetUsuarios() {
    this.usuarioSvc.GetAll().subscribe((result: UsuarioModel) => {
      if (result.statusCode == 200) {
        if (result.data.length > 0) {
          this.usuarios = result.data;
          this.dataSource = new MatTableDataSource<UsuarioModel>(this.usuarios);
          this.dataSource.sort = this.sort;
        }
        else {
          this.notifier.notify('warning', 'No se encontraron registros de Usuarios');
        }
      }
      else {
        this.notifier.notify('error', 'Ocurrió un error al intentar obtener los Usuarios. Error: ' + result.statusText);
      }
    }, error => {
      this.notifier.notify('error', 'Ha ocurrido un error al intentar cargar los Usuarios. Error: ' + error);
    });
  }
  */


  banderaCambio(){
    this.bandera.emit(true);
  }
 

}
