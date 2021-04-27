import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { RolMenuModel } from 'src/app/models/RolModel';
import { MenuService } from 'src/app/services/Admin/menu.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-menu-grupo',
  templateUrl: './menu-grupo.component.html',
  styleUrls: ['./menu-grupo.component.scss']
})
export class MenuGrupoComponent implements OnInit, OnChanges {
  @Input('rolMenu') menuAsignado: RolMenuModel[];
  @Input('rolMenuN') menuNoAsignado: RolMenuModel[];
  @Output() menuAsignadoTotal = new EventEmitter<RolMenuModel[]>();

  public listarAsignados: boolean = true;
  constructor(
    private menuSvc: MenuService,
    private notifier: NotifierService
  ) { }


  ngOnChanges(changes: SimpleChanges){

    if(changes.menuNoAsignado != null && changes.menuNoAsignado.firstChange == true && changes.menuNoAsignado.currentValue == undefined){
      this.getAllMenus();
    }

  }
  ngOnInit() {
  }


  getAllMenus(){
    this.menuSvc.getMenuRutas().subscribe((result: RolMenuModel) => {

    if(result.statusCode == 200){
      if(result.data.length > 0){
        this.menuNoAsignado = result.data;
      }
      else{
        this.notifier.notify('warning','No se encontraron registros de Menús');
      }

    }else{
      this.notifier.notify('error','Ocurrió un error al intentar obtener los Menús. Error: '+ result.statusText);
    }

    }, error => {
      this.notifier.notify(
        'error',
        'Ha ocurrido un error al intentar cargar los Menús. Error: ' + error
      );
    });
  }



  onDeleteMenus(value: any) {
    this.menuAsignado = value;
    this.menuAsignadoTotal.emit(this.menuAsignado);
  }

  onRolMenuAsignar(value: any) {
    var tmp = [];
    this.menuAsignado = this.menuAsignado.concat(value);
    this.menuAsignadoTotal.emit(this.menuAsignado);
    
    var previousN = this.menuNoAsignado;
    var currentN = value;
    
    if(previousN > currentN){
      tmp = this.diff(currentN, previousN);
    }
    else if(previousN < currentN){
      tmp = this.diff(previousN, currentN);
    }
    else{
      tmp = [];
    }
    this.menuNoAsignado = tmp;
    
    // this.menuNoAsignado = value;
    // console.log("TCL: MenuGrupoComponent -> onRolMenuAsignar -> this.menuNoAsignado", this.menuNoAsignado)

    // for(let i in value){
    //   this.menuNoAsignado.splice(value, 1);
    // }


    // // for(let i in value){
    // //   this.menuNoAsignado.pop();
    // // }
    // console.log("TCL: MenuGrupoComponent -> onRolMenuAsignar -> this.menuNoAsignado", this.menuNoAsignado)
    
    // this.menusAsignados = true;

    // if (this.rolMenuTmp.length > 0) {
    //   this.rolMenuTmp = this.rolMenuTmp.concat(value);
    // }
    // else if(!!this.rolMenu){
    //   if(this.rolMenu.length > 0){
    //     this.rolMenuTmp = this.rolMenu.concat(value);
    //   }
    //   else{
    //     //cuando es nuevo rol, aún en actualizar
    //     this.rolMenuTmp = this.rolMenuTmp.concat(value);
    //   }
    // }
    // else {
    //   //cuando es nuevo rol
    //   this.rolMenuTmp = this.rolMenuTmp.concat(value);      
    // }

  }


  asignarMenus() {
    this.listarAsignados = !this.listarAsignados;
  }


  onCancel(){
    this.listarAsignados = true;
  }

  //==========functions====//
  diff(a1, a2){// a1: algunos // a2: todos
    for(let i=0; i<a1.length; i++){
      a2 = this.deleteFunction(a2, a1[i].menuID);
    }
    
    return a2;
    //return a2[0];
  }

  deleteFunction = (arr, menuID) => (arr).filter(menu => menu.menuID != menuID);

}
