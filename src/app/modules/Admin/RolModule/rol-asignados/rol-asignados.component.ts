import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RolUsuarioModel } from 'src/app/models/RolModel';
import * as moment from 'moment';

@Component({
  selector: 'app-rol-asignados',
  templateUrl: './rol-asignados.component.html',
  styleUrls: ['./rol-asignados.component.scss']
})
export class RolAsignadosComponent implements OnInit {
  @Input() rolUsuarioAsignados: any;
  @Input() rolUsuarioAsignadosTmp: any;
  @Output() rolDeleted = new EventEmitter<RolUsuarioModel[]>();

  public rolUsuarioObj: RolUsuarioModel;
  public dataSource: RolUsuarioModel[] = [];


  displayedColumns: string[] = [
    "descripcion",
    "inicio", 
    "final",
    "actions"
  ];

  constructor() { }

  ngOnInit() {
    if(this.rolUsuarioAsignadosTmp.length > 0){      
      this.rolUsuarioAsignadosTmp.forEach(element => {
        this.rolUsuarioObj = {
          rolID: element.rolID,
          descripcion: element.descripcion,
          inicio: moment(element.inicio).format(),
          final: moment(element.final).format()
        }
        this.dataSource.push(this.rolUsuarioObj);
      });
    }else 
    if(!!this.rolUsuarioAsignados){
      //de DT:
      this.rolUsuarioAsignados.forEach(element => {
        this.rolUsuarioObj = {
          rolID: element.rolID,
          descripcion: element.descripcion,
          inicio: moment(element.inicio).format(),
          final: moment(element.final).format()          
        }
        this.dataSource.push(this.rolUsuarioObj);
      });
    }
  
  }



  desasignarRol(rol: RolUsuarioModel){
    this.dataSource = this.deleteFunction(this.dataSource, rol.rolID);
    this.rolDeleted.emit(this.dataSource);
  }

  deleteFunction = (arr, rolID) => (arr).filter(rol => rol.rolID != rolID);

}
