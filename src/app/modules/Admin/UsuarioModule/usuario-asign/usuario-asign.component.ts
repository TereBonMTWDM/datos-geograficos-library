import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RolUsuarioModel } from 'src/app/models/RolModel';
import * as moment from 'moment';
import { UsuariosService } from 'src/app/services/Admin/usuarios.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-usuario-asign',
  templateUrl: './usuario-asign.component.html',
  styles: []
})
export class UsuarioAsignComponent implements OnInit, OnChanges {
  @Input('listarAsignados') showAsignados: boolean;
  @Input('rolUsuario') usuarios: RolUsuarioModel[];
  @Output() usuariosDeleted = new EventEmitter<RolUsuarioModel[]>();
  @Output() cancelAsignar = new EventEmitter<boolean>();
  @Output() usuariosAdded = new EventEmitter<RolUsuarioModel[]>();
  public usuariosN: RolUsuarioModel[] = [];
  public dataSource: RolUsuarioModel[] = [];
  public usuarioObj: RolUsuarioModel;
  public usuarioNObj: RolUsuarioModel;
  public usuarioTmp: RolUsuarioModel[] = [];
  public usuariosSelected = [];
  public minDate = new Date();
  public fechasOk;
  public inicio;
  public final;

  displayedColumns: string[] = [
    "email",
    "inicio", 
    "final",
    "actions"
  ];

  constructor(
    private usuarioSvc: UsuariosService,
    private notifier: NotifierService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.showAsignados != null)
    {
      // this.usuariosSelected = [];
      if(changes.showAsignados.currentValue == false){
        // this.getUsuariosTodos();
        this.getUsuariosFaltantes();
      }
    }


    //asignados:
    if(changes.usuarios != null){
      if(!changes.usuarios.firstChange){
        var current = changes.usuarios.currentValue;
        var previous = changes.usuarios.previousValue;
  
        //trae diferencias
        if(current != null){
          if(current.length < previous.length){
            var usrEliminado = this.diff(current, previous);
            
            //menu Eliminado mandarlo a POR ASIGNAR
            if(this.usuariosN == undefined){
              this.usuariosN = [];
            }
            this.usuariosN.push(usrEliminado);
          }
          else{
            var usrAgregado = this.diff(previous, current);
            this.dataSource = this.usuarios;
          }
        }
      }

    }

  }

  ngOnInit() {
    //asignados:
    if(this.usuarios.length > 0){
      this.getObjUsuarios();
    }
    else {
      this.getUsuariosTodos();
    }
  }

  getObjUsuarios(){
    this.usuarios.forEach(element => {        
      this.usuarioObj = {
        usuarioID: element.usuarioID,
        email: element.email,
        inicio: moment(element.inicio).format(),
        final: moment(element.final).format()          
      }  
      this.dataSource.push(this.usuarioObj);        
    });
  }

  getUsuariosTodos() {
    this.usuarioSvc.GetNoContribuyentes().subscribe( (result: RolUsuarioModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.usuariosN = result.data;
        }
        else{
          this.notifier.notify('warning','No se encontraron registros de Usuarios');
        }
      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar obtener los Usuarios. Error: '+ result.statusText);
      }
    }, error => {
      this.notifier.notify('error','Ocurrió un error al intentar obtener los Usuarios. Error: ' + error);
    });
  }

  getUsuariosFaltantes(){

    //get all db:
    this.usuarioSvc.GetNoContribuyentes().subscribe( (result: RolUsuarioModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.usuariosN = result.data;

          for(let i = 0; i < this.usuarios.length; i++){            
            this.usuariosN = this.deleteFunction(this.usuariosN, this.usuarios[i].usuarioID);            
          }
        }
        else{
          this.notifier.notify('warning','No se encontraron registros de Usuarios');
        }
      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar obtener los Usuarios. Error: '+ result.statusText);
      }
    });

  }

  onSubmit(form){
    var fechaIni = new Date(form.value.inicio);
    var fechaFin = new Date(form.value.final);

    if ((fechaIni <= fechaFin)){
      this.usuarios = form.value.usuariosSelected;

      form.value.usuariosSelected.forEach(element => {
        this.usuarioNObj = {
          usuarioID: element.usuarioID,
          email: element.email,
          inicio: moment(form.value.inicio).format(),
          final: moment(form.value.final).format()
        }
        this.usuarioTmp.push(this.usuarioNObj);
      });
      this.usuariosAdded.emit(this.usuarioTmp);
      this.cancelAsignar.emit(true);
    }
    else{
      this.notifier.notify('error', 'La fecha de inicio debe ser menor a la fecha final');
    }
  }

  onNgModelChange(event){}  




  desasignar(usuario: RolUsuarioModel) {
    this.dataSource = this.deleteUsuariosAsignados(this.dataSource, usuario.usuarioID);
    this.usuariosDeleted.emit(this.dataSource);
  }

  
  orgValueChange(event, event2) {
    var x = new Date(event);
    var y = new Date(event2);
    if (x > y) {
      this.fechasOk = true;
    } else {
      if (x == y) {
        this.fechasOk = true;
      } else {
        this.fechasOk = false;
      }
    }
  }


  onCancelar(){
    this.cancelAsignar.emit(true);
  }


  //===functions===//
  deleteUsuariosAsignados= (arr, usuarioID) => (arr).filter(usuario => usuario.usuarioID != usuarioID);


  diff(a1, a2){// a1: algunos // a2: todos
    for(let i=0; i<a1.length; i++){
      a2 = this.deleteFunction(a2, a1[i].usuarioID);
    }
    
    return a2[0];
  }

  deleteFunction = (arr, usuarioID) => (arr).filter(usuario => usuario.usuarioID != usuarioID);

}
