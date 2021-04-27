import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RolUsuarioModel, RolModel } from 'src/app/models/RolModel';
import { RolService } from 'src/app/services/Admin/roles.service';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';

@Component({
  selector: 'app-rol-asignar',
  templateUrl: './rol-asignar.component.html',
  styleUrls: ['./rol-asignar.component.scss']
})
export class RolAsignarComponent implements OnInit {
  @Input() rolUsuarioAsignados: any;
  @Input() rolUsuarioAsignadosTmp: any;
  @Output() rolUsuarioTmp = new EventEmitter<RolUsuarioModel[]>();
  @Output() close = new EventEmitter<boolean>();
  // @Output() rolOutput = new EventEmitter<RolUsuarioModel>();


  public rolesPrev: RolUsuarioModel[];
  public roles: RolUsuarioModel[] = [];
  public rolUsuario: RolUsuarioModel[] = [];
  public rolesSelected = [];
  public rolObJ : RolUsuarioModel;
  public fechasOk;
  public inicio;
  public final;
  minDate = new Date();

  constructor(
    private rolSvc: RolService,
    private notifier: NotifierService,
  ) { }

  ngOnInit() {
    if(this.rolUsuarioAsignadosTmp.length > 0){
      this.GetRolesFaltantes(this.rolUsuarioAsignadosTmp);
    }
    else if(!!this.rolUsuarioAsignados){
      if(this.rolUsuarioAsignados.length > 0){
        this.GetRolesFaltantes(this.rolUsuarioAsignados);
      }
      else{
        //todos:
        this.GetRolesTodos();
      }
    } else {
      this.GetRolesTodos();
    }
    
  }

  onSubmit(form){
    var fechaIni = form.value.inicio;
    var fechaFin = form.value.final;

    if(fechaIni <= fechaFin){
      this.roles = form.value.rolesSelected;

      this.roles.forEach(element => {
        this.rolObJ = {
          rolID: element.rolID,
          descripcion: element.descripcion,
          inicio: moment(form.value.inicio).format(),
          final: moment(form.value.final).format()
        }
        this.rolUsuario.push(this.rolObJ);
      });
  
      this.rolUsuarioTmp.emit(this.rolUsuario);
      this.close.emit(true);
    }
    else{
      this.notifier.notify('error', 'La fecha de inicio debe ser menor a la fecha final');
    }
  }



  onCancelar(){
    this.close.emit(true);
  }

  GetRolesFaltantes(rolesAsignados: any){
    this.rolesPrev = rolesAsignados;

    //get all db:
    this.rolSvc.getAllRoles().subscribe( (result: RolUsuarioModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.roles = result.data;

          for(let i=0; i<this.rolesPrev.length; i++){
            this.roles = this.deleteFunction(this.roles, this.rolesPrev[i].rolID);
          }

        }
      }
    });
  }

  GetRolesTodos(){
    this.rolSvc.getAllRoles().subscribe( (result: RolUsuarioModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.roles = result.data;
        }
      }
    }, error => {
      this.notifier.notify('error','Ocurrió un error al intentar obtener los Menús. Error: ' + error);
    });
  }
  
  
  deleteFunction = (arr, rolID) => (arr).filter(rol => rol.rolID != rolID);
  
  onNgModelChange(event){
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

  
  

}
