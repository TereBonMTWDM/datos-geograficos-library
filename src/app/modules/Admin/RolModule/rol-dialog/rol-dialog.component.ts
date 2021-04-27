import { Component, OnInit, Optional, Inject, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolModel, RolMenuModel, RolUsuarioModel } from 'src/app/models/RolModel';
import { RolService } from 'src/app/services/Admin/roles.service';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { NgForage } from 'ngforage';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss']
})
export class RolDialogComponent implements OnInit, OnChanges {
  @Input('close') actionAsignar: boolean; // de hijo
  @Output() accionDialog = new EventEmitter<string>();
  
  // public rol: any[];
  // public rol: RolModel[] = [];
  // public rol: RolModel = new RolModel;
  public rol: RolModel;
  public rolObj: RolModel;
  public rolMenuTmp: RolMenuModel[] = [];
  public rolMenu: any;  
  public rolMenuN: any;  
  public rolUsuarioTmp: RolUsuarioModel[] = [];
  public rolUsuario: any;
  public rolMenuAsigned: RolMenuModel[] = [];
  public rolMenuObj: RolMenuModel;  
  public rolUsuarioObj: RolUsuarioModel;
  public rolUsuarioAsigned: RolUsuarioModel[] = [];
  public changeMenu: boolean;
  public changeUsr: boolean;

  form;
  action: string;
  menusAsignados: boolean = true;
  usuariosAsignados: boolean = true;
  public dataUser: any;
  public actionContinuar: boolean;

  constructor(
    private rolSvc: RolService,
    @Optional() @Inject(MAT_DIALOG_DATA) private dataModal: RolModel,
    public dialogRef: MatDialogRef<RolDialogComponent>,
    private notifier: NotifierService,
    private store: NgForage
  ) {
  }

  ngOnChanges(changes: SimpleChanges){
  }

  ngOnInit() {    

    this.dataUser = JSON.parse(localStorage.getItem('usrCitas'));
    //this.dataUser = this.store.getItem('usrCitas');
    moment.lang('es');
    this.action = this.dialogRef.componentInstance.dataModal.action;
    this.rol = this.dialogRef.componentInstance.dataModal;
    
    if (this.action == 'Agregar') {
      this.rolMenu = [];
      this.rolUsuario = [];

    }
    else {
      this.rol.creacion = moment(this.rol.creacion).format('LLL');
      this.rol.modificacion = moment(this.rol.modificacion).format('LLL');

      if (!!this.rol.rolMenu) {
        this.menusAsignados = true;
        this.rolMenu = this.rol.rolMenu;
        this.rolMenuN = this.rol.rolMenuN;
      }
      
      if(!!this.rol.rolUsuario){
        this.usuariosAsignados = true;
        this.rolUsuario = this.rol.rolUsuario;
      }
    }
  }

  // get descripcion() { return this.form.fet('descripcion')}



  onSubmit() {
  }

  asignarTemporales(){  
    //ROL-MENU
    this.rolMenu = this.rol.rolMenu;

    if(this.changeMenu){
      this.rolMenuAsigned = this.rolMenuAsigned;
    }
    else{
      if(this.rolMenu != undefined){
        this.rolMenuAsigned = this.rolMenu;
      }
      else{
        this.rolMenuAsigned = [];
      }
    }


    //ROL-USUARIO
    this.rolUsuario = this.rol.rolUsuario;

    if(this.changeUsr){
      this.rolUsuarioAsigned = this.rolUsuarioAsigned;
    }
    else{
      if(this.rolUsuario != undefined){
        this.rolUsuarioAsigned = this.rolUsuario;
      }
      else{
        this.rolUsuarioAsigned = [];
      }
    }

    //========obj complete========
    //todo el objeto rol
    this.rolObj = {
      rolID: this.rol.rolID,
      descripcion: this.rol.descripcion,
      estatus: true,
      UsuarioID: this.dataUser['idx'],
      rolMenu: this.rolMenuAsigned,
      rolUsuario: this.rolUsuarioAsigned
    }
  }


  asignarMenus() {
    this.menusAsignados = !this.menusAsignados;
  }

  // asignarUsuarios() {
  //   this.usuariosAsignados = !this.usuariosAsignados;
  // }



  onCancelMenuAdd(event: boolean) {
    this.menusAsignados = !this.menusAsignados;
  }



 

  asignarUsrCancel(value: boolean) {
    this.usuariosAsignados = value;
    //this.usuariosAsignados = !this.usuariosAsignados;
  }
  asignarMenuCancel(value: boolean){
    this.menusAsignados = value;
  }



  onActualizar() {
    this.asignarTemporales();
    this.updateRol(this.rolObj);
  }

  onGuardar(){
    this.asignarTemporales();
    this.saveRol(this.rolObj);
    
  }

  saveRol(rolObj: RolModel) {
    this.rolSvc.addRol(rolObj).subscribe((result: RolModel) => {
      if (result.statusCode == 201) {
        this.actionContinuar = true;
        this.notifier.notify('success', 'Rol guardado correctamente.');
        this.dialogRef.close();
      
        this.rol[0] = result.data[0];
      }
      else {
        this.notifier.notify('error', 'Ocurrió un error al intentar guardar el Rol. Error: ' + result.statusText);
      }
    }, error => {
      this.notifier.notify('error', 'Ocurrió un error al intentar guardar el Rol. Error: ' + error);
    });
  }



  updateRol(rol: RolModel) {
    this.rolSvc.updateRol(rol).subscribe((result: RolModel) => {
      if (result.statusCode == 201) {
        this.actionContinuar = true;
        this.notifier.notify('success', 'Rol actualizado correctamente.');
        this.dialogRef.close();
      }
      else {
        this.notifier.notify('error', 'Ocurrió un error al intentar actualizar el Rol. Error: ' + result.statusText);
      }
    }, error => {
      this.notifier.notify('error', 'Ocurrió un error al intentar actualizar el Rol. Error: ' + error);
    });
  }


  

  onRolUsuario(value: any){
    this.usuariosAsignados = true;
    if(!!this.rolUsuario){
      this.rolUsuarioTmp = this.rolUsuario.concat(value);
    }
    else{
      this.rolUsuarioTmp = value;      
    }
  }
  onRolMenu(value: any){
    this.menusAsignados = true;
    if(!!this.rolMenu){
      this.rolMenuTmp = this.rolMenu.concat(value);
    }
    else{
      this.rolMenuTmp = value;
    }

  }



  onRolMenuAsignar(value: any) {
    this.menusAsignados = true;

    if (this.rolMenuTmp.length > 0) {
      this.rolMenuTmp = this.rolMenuTmp.concat(value);
    }
    else if(!!this.rolMenu){
      if(this.rolMenu.length > 0){
        this.rolMenuTmp = this.rolMenu.concat(value);
      }
      else{
        //cuando es nuevo rol, aún en actualizar
        this.rolMenuTmp = this.rolMenuTmp.concat(value);
      }
    }
    else {
      //cuando es nuevo rol
      this.rolMenuTmp = this.rolMenuTmp.concat(value);      
    }

  }

  onRolUsuarioAsignar(value: any){    
    this.usuariosAsignados = true;

    if(this.rolUsuarioTmp.length > 0){
      this.rolUsuarioTmp = this.rolUsuarioTmp.concat(value);
    }
    else if(!!this.rolUsuario){
      if(this.rolUsuario.length > 0){
        this.rolUsuarioTmp = this.rolUsuario.concat(value);        
      }
      else{
        //cuando es nuevo rol aún en actualizar
        this.rolUsuarioTmp = this.rolUsuarioTmp.concat(value);
      } 
    }
    else{
      //cuando es nuevo rol
      this.rolUsuarioTmp = this.rolUsuarioTmp.concat(value);
    } 
  }
  
  
  


  onDeleteMenus(menusAfterDeleted: any) {
    this.rolMenuTmp = menusAfterDeleted;
    this.rolMenu = this.rolMenuTmp;
  }

  onDeleteUsuario(usuarioAfterDeleted: any) {
    this.rolUsuarioTmp = usuarioAfterDeleted;

    //try
    this.rolUsuario = this.rolUsuarioTmp;
  }

  

  onCancelar(accion: string) {
    this.dialogRef.close();
    this.accionDialog.emit(accion);
  }


  onMenuAsignadoTotal(value: RolMenuModel[]){
    //this.rolMenuTmp = value;
    this.rolMenuAsigned = value;
    this.changeMenu = true;
  }




  onUsrAsignadoTotal(value: RolUsuarioModel[]){
    this.rolUsuarioAsigned = value;
    this.changeUsr = true;
  }
  


}
