import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RolUsuarioModel } from 'src/app/models/RolModel';

@Component({
  selector: 'app-usuario-grupo',
  templateUrl: './usuario-grupo.component.html',
  styleUrls: ['./usuario-grupo.component.scss']
})
export class UsuarioGrupoComponent implements OnInit {
  @Input('rolUsuario') usuarios: RolUsuarioModel[];
  // @Input('rolUsuarioN') menuNoAsignado: RolMenuModel[];
  @Output() usuariosAsignadoTotal = new EventEmitter<RolUsuarioModel[]>();

  public listarAsignados: boolean = true;

  constructor() { }

  ngOnInit() {}



  asignarUsuarios(){
    this.listarAsignados = !this.listarAsignados;
  }



  onDeleteUsuarios(value: any){
    this.usuarios = value;
    this.usuariosAsignadoTotal.emit(this.usuarios);
  }

  onRolUsuarioAsignar(value: any){
    var tmp = [];
    this.usuarios = this.usuarios.concat(value);
    this.usuariosAsignadoTotal.emit(this.usuarios);

    // var previousN = this.usuario;
    // var currentN = value;
    
    // if(previousN > currentN){
    //   tmp = this.diff(currentN, previousN);
    // }
    // else if(previousN < currentN){
    //   tmp = this.diff(previousN, currentN);
    // }
    // else{
    //   tmp = [];
    // }
    // this.menuNoAsignado = tmp;
  }


  onCancel(){
    this.listarAsignados = true;
  }

}
