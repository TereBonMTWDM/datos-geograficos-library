import { Component, OnInit, Inject, Optional, ViewChild, ElementRef, SimpleChanges, ɵConsole } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource, MatSort, MatTable, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MenuService } from "../../../../services/Admin/menu.service";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
import { GuardsCheckStart } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../../../libreriasGernerales/date.adapter";
import { NgForage } from 'ngforage';

@Component({
  selector: 'app-menus-actions',
  templateUrl: './menus-actions.component.html',
  styleUrls: ['./menus-actions.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class MenusActionsComponent implements OnInit {
  formMenu;
  formFechaRoles;
  datosMenu;
  datosMenuById;
  datosRoles;
  dataSource = null;
  minDate = new Date();
  dataSource2;
  listadoAddRoles;
  seleccionAdd;
  seleccionUpdate;
  roles;
  fechasOk;
  dataServiceSub;
  seleccionNum;
  accionModal;
  dataUser;
  idMenu = 1;
  sucess;
  isLinear = true;

  displayedColumns: string[] = [
    "Nombre",
    "Inicio",
    "Final",
    'actions'
  ];

  /* definiciones para la segunda tabla de roles*/
  displayedColumns2: string[] = [
    "select",
    "descripcion",
  ];
  selection = new SelectionModel<any>(true, []);


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) exportTable: ElementRef;

  @ViewChild(MatTable, { static: false }) Table: MatTable<any>;

  constructor(
    private dataService: MenuService, 
    private notifier: NotifierService, 
    private formBuilder: FormBuilder,
    private store: NgForage,
    public dialogRef: MatDialogRef<MenusActionsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) 
    private dataModal: any) {
    this.formMenu = this.formBuilder.group({
      Texto: '',
      Descripcion: '',
      Href: '',
      Target: '',
      Publico: '',
      //Externo: '',
      Posicion: '',
      Padre: ''
    });
    this.formFechaRoles = this.formBuilder.group({
      Inicio:'',
      Final:''
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.formMenu.controls[controlName].hasError(errorName);
  }

  public hasErrorfechas = (controlName: string, errorName: string) => {
    return this.formFechaRoles.controls[controlName].hasError(errorName);
  }

  async ngOnInit() {
    this.getDataRolesAdd();
    this.getData();
    this.dataUser =  await this.store.getItem('usrCitas');
    this.accionModal = this.dialogRef.componentInstance.dataModal.action;

    this.formFechaRoles = this.formBuilder.group({
      Inicio: ['', Validators.required],
      Final: ['', Validators.required]
    });
    if (this.accionModal == "Agregar") {
      this.menuBuilder();
      this.getDataRolesAdd();
    }
    if (this.accionModal == "Actualizar") {
      //this.getDataRoles();
      this.idMenu = this.dialogRef.componentInstance.dataModal.menuID
      this.dataServiceSub=this.dataService.getDataById(this.idMenu).subscribe(
        data => {
          if (data['data'] && data['data'].length > 0) {
            if (data['data'][0].publico == true) {
              data['data'][0].publico = '1'
            } else {
              data['data'][0].publico = '0'
            }
            // if (data['data'][0].externo == true) {
            //   data['data'][0].externo = '1'
            // } else {
            //   data['data'][0].externo = '0'
            // }
            this.datosMenuById = data['data'][0];
            this.getDataRoles(this.datosMenuById)
            if (this.dialogRef.componentInstance.dataModal.padre==0){
              this.dialogRef.componentInstance.dataModal.padre=null
            }
            this.dataSource = new MatTableDataSource<any>(this.datosMenuById.rolMenu);
            this.dataSource.paginator = this.paginator;
            this.formMenu = new FormGroup({
              Texto: new FormControl(this.dialogRef.componentInstance.dataModal.texto, [Validators.required, Validators.maxLength(40)]),
              Descripcion: new FormControl(this.dialogRef.componentInstance.dataModal.descripcion, [Validators.required, Validators.maxLength(100)]),
              Href: new FormControl(this.dialogRef.componentInstance.dataModal.href, [Validators.required, Validators.maxLength(250)]),
              Target: new FormControl(this.dialogRef.componentInstance.dataModal.target, [Validators.required]),
              Publico: new FormControl(this.datosMenuById.publico, [Validators.required]),
              //Externo: new FormControl(this.datosMenuById.externo, [Validators.required]),
              Posicion: new FormControl(this.datosMenuById.posicion, [Validators.required]),
              Padre: new FormControl(this.dialogRef.componentInstance.dataModal.padre)
            });
          }
        },
        error => {
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
          );
        }
      );
    }
  }
  /*funcion para eliminar roles asignados*/
  deleteRol = (arr, rolID) => (arr).filter(rol => rol.rolID != rolID)
  deleteMenu = (arr, menuID) => (arr).filter(menu => menu.menuID != menuID)


  
  guardarMenu(formMenu) {
    if (!this.formMenu.valid) return;
    formMenu['Inicio'] = moment(formMenu['Inicio']).format();
    formMenu['Final'] = moment(formMenu['Inicio']).format();
    formMenu['Publico'] = parseInt(formMenu['Publico']);
    //formMenu['Externo'] = parseInt(formMenu['Externo']);
    formMenu['Posicion'] = parseInt(formMenu['Posicion']);
    formMenu['Padre'] = parseInt(formMenu['Padre']);
    delete (formMenu)["Inicio"];
    delete (formMenu)["Final"];

    (formMenu)['Estatus'] = 1;
    (formMenu)['UsuarioID'] = this.dataUser['idx'];


    if (this.dataModal.action == "Agregar") {
      (formMenu)['MenuID'] = 0;
      if (this.dataSource == null) {
        (formMenu)['RolMenu'] = new Array();
      } else {
        (formMenu)['RolMenu'] = this.dataSource.filteredData;
      }
      this.dataServiceSub =this.dataService.addMenu(formMenu).subscribe(
        result => {
          this.notifier.notify(
            'success',
            'Exito al agregar el nuevo menú'
          );
          this.dialogRef.close({ sucess: true });
        },
        error => {
          this.dialogRef.close({ sucess: false });
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar guardar el menú. Contacta al administrador.'
          );
        }
      );
    }
    if (this.dataModal.action == "Actualizar") {
      (formMenu)['MenuID'] = 0;
      if (this.dataSource == null) {
        (formMenu)['RolMenu'] = new Array();
      } else {
        (formMenu)['RolMenu'] = this.dataSource.filteredData;
      }
      this.dataServiceSub =this.dataService.updateMenu(formMenu, this.dialogRef.componentInstance.dataModal.menuID).subscribe(
        result => {
          this.notifier.notify(
            'success',
            'Exito al actualizar el menú'
          );
          this.dialogRef.close({ sucess: true });
        },
        error => {
          this.dialogRef.close({ sucess: false });
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar guardar el menú. Contacta al administrador.'
          );
        }
      );
    }
  }
  orgValueChange(event) {
    var x = new Date(event.Inicio);
    var y = new Date(event.Final);
    if(x>y){
      this.fechasOk = true;
    }else{
      if(x==y){
        this.fechasOk = true;
      }else{
        this.fechasOk = false;
      }
    }
  }


  deleteRolMenu(objeto) {
    this.dataServiceSub = this.dataService.deleteRolMenu(objeto, this.idMenu, this.dataUser).subscribe(
      data => {
        if (data['statusCode'] == 500) {
          this.notifier.notify(
            'error',
            data['statusText']
          );
        } else {
          this.getDataById(this.idMenu);
          this.notifier.notify(
            'success',
            'Exito al eliminar el rol asignado.'
          );
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al eliminar, favor de contactar al administrador'
        );
      }
    );
  }

  deleteRolMenuAdd(row){
    this.listadoAddRoles = this.deleteRol(this.dataSource.filteredData, row.rolID);
    this.dataSource = new MatTableDataSource<any>(this.listadoAddRoles);
    
    this.dataServiceSub =this.dataService.getAllRoles().subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.datosRoles = data['data'];
          for (let index = 0; index < this.dataSource.filteredData.length; index++) {
            this.datosRoles = this.deleteRol(this.datosRoles, this.dataSource.filteredData[index].rolID)
          }
          this.dataSource2 = new MatTableDataSource<any>(this.datosRoles);
          this.selection.clear()
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
        );
      }
    );
  }

  /* funciones para listado y seleccion de checks*/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    try {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource2.data.length;
      this.seleccionNum = this.selection.selected.length;
      return numSelected === numRows;
    } catch{ }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource2.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  menuBuilder() {
    this.formMenu = new FormGroup({
      Texto: new FormControl(this.dialogRef.componentInstance.dataModal.texto, [Validators.required, Validators.maxLength(40)]),
      Descripcion: new FormControl(this.dialogRef.componentInstance.dataModal.descripcion, [Validators.required, Validators.maxLength(100)]),
      Href: new FormControl(this.dialogRef.componentInstance.dataModal.href, [Validators.required, Validators.maxLength(250)]),
      Target: new FormControl(this.dialogRef.componentInstance.dataModal.target, [Validators.required]),
      Publico: new FormControl(this.dialogRef.componentInstance.dataModal.publico, [Validators.required]),
      //Externo: new FormControl(this.dialogRef.componentInstance.dataModal.externo, [Validators.required]),
      Posicion: new FormControl(this.dialogRef.componentInstance.dataModal.posicion, [Validators.required]),
      Padre: new FormControl(this.dialogRef.componentInstance.dataModal.padre)

    });

  }

  getData() {
    this.dataServiceSub =this.dataService.getMenusAll().subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.datosMenu = data['data'];
            this.datosMenu = this.deleteMenu(this.datosMenu, this.idMenu)
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
        );
      }
    );
  };

  getDataById(idMenu) {
    this.dataServiceSub =this.dataService.getDataById(idMenu).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          if (data['data'][0].publico == true) {
            data['data'][0].publico = '1'
          } else {
            data['data'][0].publico = '0'
          }
          // if (data['data'][0].externo == true) {
          //   data['data'][0].externo = '1'
          // } else {
          //   data['data'][0].externo = '0'
          // }
        }
        this.datosMenuById = data['data'][0];
        this.dataSource = new MatTableDataSource<any>(this.datosMenuById.rolMenu);
        this.getDataRoles(this.datosMenuById)
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
        );
      }
    );
  }

  getDataRolesAdd() {
    this.dataServiceSub =this.dataService.getAllRoles().subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.datosRoles = data['data'];
          this.dataSource2 = new MatTableDataSource<any>(this.datosRoles);
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
        );
      }
    );

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  getDataRoles(dataById?) {
    this.dataServiceSub =this.dataService.getAllRoles().subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.datosRoles = data['data'];
          for (let index = 0; index < dataById.rolMenu.length; index++) {
            this.datosRoles = this.deleteRol(this.datosRoles, dataById.rolMenu[index].rolID)
          }
          this.dataSource2 = new MatTableDataSource<any>(this.datosRoles);
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
        );
      }
    );
  };

  guardarListado(formFechaRoles) {
    
    this.selection['_selected'] = this.selection['_selected'].map(r => ({ rolID: r.rolID, descripcion: r.descripcion, inicio: moment(formFechaRoles.Inicio).format(), final: moment(formFechaRoles.Final).format() }))
    this.seleccionUpdate = this.selection['_selected'];
    this.seleccionUpdate = this.seleccionUpdate.map(rol => ({ rolID: rol.rolID, MenuID: this.idMenu, inicio: moment(formFechaRoles.Inicio).format(), final: moment(formFechaRoles.Final).format(), UsuarioID: this.dataUser['idx'] }))
      if (this.dataSource == null || this.dataSource.filteredData==[]){
        this.dataSource = new MatTableDataSource<any>(this.selection['_selected']);
      }else{
        this.dataSource = new MatTableDataSource<any>(this.dataSource.filteredData.concat(this.selection['_selected']))
      }
    this.dataServiceSub =this.dataService.getAllRoles().subscribe(
        data => {
          if (data['data'] && data['data'].length > 0) {
            this.datosRoles = data['data'];
            
            for (let index = 0; index < this.dataSource.filteredData.length; index++) {
              this.datosRoles = this.deleteRol(this.datosRoles, this.dataSource.filteredData[index].rolID)
            }
            this.dataSource2 = new MatTableDataSource<any>(this.datosRoles);
            this.selection.clear()
            this.formFechaRoles = this.formBuilder.group({
              Inicio: ['', Validators.required],
              Final: ['', Validators.required]
            });
          }
        },
        error => {
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
          );
        }
      );
  }
  ngOnDestroy() {
    this.dataServiceSub.unsubscribe();
  }

  postRolMenu(dataSeleccion) {
    this.dataServiceSub =this.dataService.postRolMenu(dataSeleccion).subscribe(
      data => {
        this.getDataById(this.idMenu);
        this.notifier.notify(
          'success',
          'Exito al agregar seleccion de roles'
        );
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
        );
      }
    );
  }

}
