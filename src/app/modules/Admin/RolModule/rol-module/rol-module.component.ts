import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatIconModule, MatButtonModule } from '@angular/material';
import * as XLSX from 'xlsx';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MatTable } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { i_lrol } from "../../../../interfaces/interfaces";
import { RolService } from "../../../../services/Admin/roles.service";
import { RolDialogComponent } from '../rol-dialog/rol-dialog.component';
import { RolModel } from 'src/app/models/RolModel';
import { MenuService } from '../../../../services/Admin/menu.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { NgForage } from 'ngforage';


@Component({
  selector: 'app-rol-module',
  templateUrl: './rol-module.component.html',
  styleUrls: ['./rol-module.component.scss']
})
export class RolModuleComponent implements OnInit {
  roles: RolModel[];
  //rolObj: RolModel;

  // MatPaginator Inputs
  //pageSize = 10;
  // MatPaginator Output
  pageSizeOptions;
  pageEvent: PageEvent;
  totalRows: number;
  totalPages: number;  
  _tam;
  _pag;
  _length;

  tablaRoles: i_lrol[];
  dataSource = null;
  dataExcel;
  dataUser;

  descripcion = '';
  


  count = 1;
  thisUrl;
  tituloPage;
  acceso;
  dataMenuActual;
  searchFilter;
  displayedColumns: string[] = [
    "descripcion",
    "actions"
  ];
  

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) exportTable: ElementRef;

  @ViewChild(MatTable, { static: false }) Table: MatTable<any>;

  constructor(
    private rolSvc: RolService,
    // private dataService: RolService, 
    private dataServiceMenu: MenuService, 
    private notifier: NotifierService,
    private authService: AuthService,
    private router: Router,
    private store: NgForage, 
    private fb: FormBuilder) {
    this.searchFilter = this.fb.group({
      descripcion: ''
    });
     }

  async ngOnInit() {
    this.dataUser = await this.store.getItem('usrCitas');
    this.pageSizeOptions = [10,20,30];
    this._tam = this.pageSizeOptions[0];
    this._pag = 1;

    this.GetRoles(this._tam, this._pag);

    this.searchFilter = new FormGroup({
      descripcion: new FormControl(''),
    });
  }


  GetRoles(tam: number, pag: number) {
    if(!!this.paginator){
      if(tam == 0 && pag == 0){
        tam = this._tam;
        //pag = this._pag + 1;
        pag = this.paginator.pageIndex + 1;
      }
    }
    this.rolSvc.Get(tam, pag).subscribe((result: RolModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.roles = result.data;
          this.dataSource = new MatTableDataSource<i_lrol>(this.roles);
          this.totalRows = result['pagedData']['totalRows'];
          this.totalPages = result['pagedData']['totalPages']
          this.dataSource.sort = this.sort;
        }
        else{
          this.notifier.notify('warning','No se encontraron registros de Roles');
        }
      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar obtener los Roles. Error: '+ result.statusText);
      }
    }, error => {
      this.notifier.notify(
        'error',
        'Ha ocurrido un error al intentar cargar los Roles. Error: ' + error
      );
    });   
  };

  GetDataByFilter() {
    const descripcion = this.searchFilter.get('descripcion').value;

    this.rolSvc.getRolFilter(descripcion).subscribe((result: RolModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.roles = result.data;
          this.dataSource = new MatTableDataSource<i_lrol>(this.roles);          
          this.dataSource.sort = this.sort;
        }
        else{
          this.notifier.notify('warning','No se encontraron registros de Roles');
        } 
      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar obtener los Roles. Error: '+ result.statusText);
      }

      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los Roles. Error: ' + error
        );
      }
    );
  }


  QuitarFiltros(){
    this.GetRoles(this._tam, this._pag);
    this.descripcion = '';
    
  }

 
  getDataMenuActual() {
    this.thisUrl = window.location.href;
    this.tituloPage = this.thisUrl.split('#', 2);
    this.dataServiceMenu.getMenusActual(this.tituloPage[1]).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.dataMenuActual = data['data'][0];
        }
      },
      error => {
        
      }
    );
  };

  


  ngAfterViewInit() {
    let bttnclick = document.getElementsByClassName("mat-paginator-navigation-next");
    (bttnclick[0]).addEventListener("click", () => this.pageMas())
    let bttnclickmenos = document.getElementsByClassName("mat-paginator-navigation-previous ");
    (bttnclickmenos[0]).addEventListener("click", () => this.pageMenos())

    this.paginator.page.subscribe(
      (event) => {
        this._length = event.length;

        if(this._tam != event.pageSize){
          //sólo si se hace cambio de tamaño de página:
          this.GetRoles(event.pageSize, 1);
          this.paginator.pageIndex = 0;
        }
        this._tam = event.pageSize;
        this._pag = event.pageIndex;
      }       
    );
  }

  pageMas() {
    if(this.paginator.pageIndex == 0){
      this.paginator.pageIndex++;
    } 

    if(this.paginator.pageIndex <= this._length){
      this._tam = this.paginator.pageSize;
      this._pag = this.paginator.pageIndex;
      this.GetRoles(this.paginator.pageSize, this.paginator.pageIndex +1)
    }   
  }

  pageMenos() {
    if(this.paginator.pageIndex <= this._length){
      this._tam = this.paginator.pageSize;
      this._pag = this.paginator.pageIndex;
      this.GetRoles(this.paginator.pageSize, this.paginator.pageIndex +1)
    }
    
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ExportTOExcel() {
    this.dataExcel = this.dataSource.data;
    this.dataExcel = this.dataExcel.map(data => ({
      Descripcion: data.descripcion
    }));

    const workSheet = XLSX.utils.json_to_sheet(this.dataExcel);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    workSheet['A1'].S = { 'bold': true};
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Roles');
    XLSX.writeFile(workBook, 'Roles_Listado.xlsx');
  }
}
