import { Component, OnInit, Optional, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { RolUsuarioModel, RolMenuModel } from 'src/app/models/RolModel';
import * as moment from 'moment';
import { UsuariosService } from 'src/app/services/Admin/usuarios.service';
import { NotifierService } from 'angular-notifier';
import { NgForage } from 'ngforage';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent implements OnInit {
  @Input('close') actionAsignar: boolean; // de hijo
  @Output() accionDialog = new EventEmitter<string>();
  
  action: string;
  public usuario: UsuarioModel;
  public usuarioObj: UsuarioModel;
  rolesAsignados: boolean = true;
  //public roles: RolUsuarioModel;
  public rolUsuario: any;
  public rolUsuarioTmp: RolUsuarioModel[] = [];
  public rolUsuarioObj: RolUsuarioModel;
  public rolUsuarioAsigned: RolUsuarioModel[] = [];
  public dataUser: any;
  form;

  constructor(
    private usuarioSvc: UsuariosService,
    private notifier: NotifierService,
    private store: NgForage, 
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dataModal: any,
  ) { }

  async ngOnInit() {
    this.dataUser = await this.store.getItem('usrCitas');
    moment.lang('es');
    
    this.usuario = this.dialogRef.componentInstance.dataModal;

    if(!!this.usuario.rolUsuario){
      this.rolesAsignados = true;
      this.rolUsuario = this.usuario.rolUsuario;
    }
  }

  get descripcion() { return this.form.fet('descripcion')}

  onSubmit(){}



  asignarTemporales(){    
    //ROL-USUARIO:
    var distinctU: RolUsuarioModel[] = [];

    this.rolUsuarioTmp.forEach(element => {
      this.rolUsuarioObj = {
        rolID: element.rolID,
        // descripcion: element.descripcion,
        inicio: moment(element.inicio).format(),
        final: moment(element.final).format()
      }      
      this.rolUsuarioAsigned.push(this.rolUsuarioObj);
    });

    if(!!this.rolUsuario){
      this.rolUsuario.forEach(element => {
        this.rolUsuarioObj = {
          rolID: element.rolID,
          // descripcion: element.descripcion,
          inicio: moment(element.inicio).format(),
          final: moment(element.final).format()
        }      
        this.rolUsuarioAsigned.push(this.rolUsuarioObj);
      });
    }

    distinctU = this.rolUsuarioAsigned.filter((value, i, arr) => arr.findIndex(t => t.rolID === value.rolID) === i);

    this.rolUsuarioAsigned = distinctU;
   
    //========obj complete========
    //todo el objeto usuario
    this.usuarioObj = {
      email: this.usuario.email,
      estatus: true,
      creador: this.dataUser.idx,
      rolUsuario: this.rolUsuarioAsigned
    }
  }



  asignarRoles(){
    this.rolesAsignados = !this.rolesAsignados;
  }


  onAsignarRolCancel(event: boolean){
    this.rolesAsignados = event;
  }



  onActualizar() {
    this.asignarTemporales();
    this.UpdateUsuario(this.usuarioObj);

  }

  UpdateUsuario(usuario: UsuarioModel){
    this.usuarioSvc.Update(usuario).subscribe((result: UsuarioModel) => {
      if(result.statusCode == 201){
        this.notifier.notify('success', 'Usuario actualizado correctamente.');
        this.dialogRef.close();
      }else{
        this.notifier.notify('error', 'Ocurrió un error al intentar actualizar el Usuario. Error: ' + result.statusText);
      }
    }, error => {
      this.notifier.notify('error', 'Ocurrió un error al intentar actualizar el Usuario. Error: ' + error);
    });
  }



  onRolUsuario(event: any){
    this.rolesAsignados = true;
    if(!!this.rolUsuario){
      this.rolUsuarioTmp = this.rolUsuario.concat(event);
    } else{
      this.rolUsuarioTmp = event;
    }
  }


  onRolUsuarioAsignar(event: any){
    this.rolesAsignados = true;

    if(this.rolUsuarioTmp.length > 0){
      this.rolUsuarioTmp = this.rolUsuarioTmp.concat(event);
    } else if(!!this.rolUsuario){
      if(this.rolUsuario.length > 0){
        this.rolUsuarioTmp = this.rolUsuario.concat(event);
      } else {
        this.rolUsuarioTmp = this.rolUsuarioTmp.concat(event);
      }
    } else {
      this.rolUsuarioTmp = this.rolUsuarioTmp.concat(event);
    }
  }

  onDeleteRoles(event: any){
    this.rolUsuarioTmp = event;
    this.rolUsuario = this.rolUsuarioTmp;

  }


  
  onCancelar(accion: string) {
    this.dialogRef.close();
    this.accionDialog.emit(accion);
  }



}
