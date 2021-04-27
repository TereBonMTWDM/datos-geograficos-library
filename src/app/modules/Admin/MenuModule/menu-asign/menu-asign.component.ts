import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RolMenuModel } from 'src/app/models/RolModel';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-menu-asign',
  templateUrl: './menu-asign.component.html',
  styleUrls: ['./menu-asign.component.scss']
})
export class MenuAsignComponent implements OnInit, OnChanges {
  @Input('rolMenuAsignados') menuAsignados: RolMenuModel[];
  @Input('rolMenuNoAsignados') menuNoAsignados: RolMenuModel[];
  @Input('listarAsignados') showAsignados: boolean;
  @Output() menusDeleted = new EventEmitter<RolMenuModel[]>();
  @Output() menusAdded = new EventEmitter<RolMenuModel[]>();
  @Output() cancelAsignar = new EventEmitter<boolean>();

  public dataSource: RolMenuModel[] = [];
  public menuTmp: RolMenuModel[] = [];
  public menuObj: RolMenuModel;
  public menuNoObj: RolMenuModel;
  public menusSelected = [];
  public minDate = new Date();
  public fechasOk;
  public inicio;
  public final;

  displayedColumns: string[] = [
    "texto",
    "inicio", 
    "final",
    "actions"
  ];
  constructor(
    private notifier: NotifierService,
  ) { }

  ngOnChanges(changes: SimpleChanges){
    //asignados:
    if(changes.menuAsignados != null){
      if(!changes.menuAsignados.firstChange){
        var current = changes.menuAsignados.currentValue;
        var previous = changes.menuAsignados.previousValue;
  
        //trae diferencias
        if(current != null){
          if(current.length < previous.length){
            var menuEliminado = this.diff(current, previous);
            
            //menu Eliminado mandarlo a POR ASIGNAR
            if(this.menuNoAsignados == undefined){
              this.menuNoAsignados = [];
            }
            this.menuNoAsignados.push(menuEliminado);
          }
          else{
            var menuAgregado = this.diff(previous, current);
            this.dataSource = this.menuAsignados;
          }

        }
      }

    }

    if(changes.menuNoAsignados != null) {
      if(!changes.menuNoAsignados.firstChange){
        this.menuNoAsignados = changes.menuNoAsignados.currentValue;
        
        
      }

    }

    if(changes.showAsignados != null)
    {
      this.menusSelected = [];
    }

  }

  ngOnInit() {
    //asignados:
    this.menuAsignados.forEach(element => {        
      this.menuObj = {
        menuID: element.menuID,
        texto: element.texto,
        inicio: moment(element.inicio).format(),
        final: moment(element.final).format()          
      }  
      this.dataSource.push(this.menuObj);        
    });
  }


  desasignarMenu(menu: RolMenuModel) {
    this.dataSource = this.deleteMenusAsignados(this.dataSource, menu.menuID);    
    this.menusDeleted.emit(this.dataSource);    
  }

  deleteMenusAsignados= (arr, menuID) => (arr).filter(menu => menu.menuID != menuID);




  //============ por asignar ==============//
  onSubmit(form){
    this.menuTmp = [];
    // this.menuNoAsignados = form.value.menusSelected;
    var fechaIni = form.value.inicio;
    var fechaFin = form.value.final;

    if(fechaIni <= fechaFin){
      //this.menuNoAsignados.forEach(element => {
        form.value.menusSelected.forEach(element => {
        this.menuNoObj = {
          menuID: element.menuID,
          texto: element.texto,
          inicio: moment(form.value.inicio).format(),
          final: moment(form.value.final).format()
        }        
        this.menuTmp.push(this.menuNoObj);
        // this.rolMenus.push(this.menuNoObj);
      });
      this.menusAdded.emit(this.menuTmp);
      // this.rolMenusTmp.emit(this.rolMenus);
      // this.menusAdded.emit(form.value.menusSelected);
      this.cancelAsignar.emit(true);
    }
    else{
      this.notifier.notify('error', 'La fecha de inicio debe ser menor a la fecha final');
    }
  }
  onNgModelChange(event){
  }  


  onCancelar(){
    this.cancelAsignar.emit(true);
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




  //==========functions=========//
  diff(a1, a2){// a1: algunos // a2: todos
    for(let i=0; i<a1.length; i++){
      a2 = this.deleteFunction(a2, a1[i].menuID);
    }
    
    return a2[0];
  }

  deleteFunction = (arr, menuID) => (arr).filter(menu => menu.menuID != menuID);

}
