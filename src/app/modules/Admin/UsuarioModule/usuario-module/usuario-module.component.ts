import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuService } from 'src/app/services/Admin/menu.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UsuariosService } from 'src/app/services/Admin/usuarios.service';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { NotifierService } from 'angular-notifier';
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import * as XLSX from 'xlsx';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-usuario-module',
  templateUrl: './usuario-module.component.html',
  styleUrls: ['./usuario-module.component.scss']
})
export class UsuarioModuleComponent implements OnInit {
  apellido1 = '';
  apellido2 = '';
  nombre = '';
  curp = '';
  sexo = '';
  rfc = '';
  celular = '';

  totalRows: number;
  count = 1;
  totalPages: number;
  pageEvent: PageEvent;
  pageSizeOptions;
  _tam;
  _pag;
  _length;

  dataExcel;

  /* #region  #Nombre Página */
  dataMenuActual;
  thisUrl;
  tituloPage;
  /* #endregion */

  searchFilter: FormGroup;
  usuarios: UsuarioModel[];
  usuarioObj: UsuarioModel;
  dataSource = null;



  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) exportTable: ElementRef;
  @ViewChild(MatTable, { static: false }) Table: MatTable<any>;
  
  constructor(
    private menuSvc: MenuService, // get menu actual correspondiente
    private usuarioSvc: UsuariosService,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.pageSizeOptions = [10,20,30];

    this._tam = this.pageSizeOptions[0];
    this._pag = 1;
    this.GetUsuarios(this._tam, this._pag);
    this.searchFilter = this.fb.group({
      apellido1: new FormControl(''),
      apellido2: new FormControl(''),
      nombre: new FormControl(''),
      curp: new FormControl(''),
      sexo: new FormControl(''),
      rfc: new FormControl(''),
      celular: new FormControl('')
    })
  }



  getDataMenuActual() {
    this.thisUrl = window.location.href;
    this.tituloPage = this.thisUrl.split('#', 2);
    this.menuSvc.getMenusActual(this.tituloPage[1]).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.dataMenuActual = data['data'][0];
        }
      },
      error => {

      }
    );
  };



  GetUsuarios(tam: number, pag: number){
    if(tam == 0 && pag == 0){
      tam = this._tam;
      pag = this._pag + 1;
    }
    this.usuarioSvc.Get(tam, pag).subscribe( (result: UsuarioModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.usuarios = result.data;
          this.dataSource = new MatTableDataSource<UsuarioModel>(this.usuarios);          
          this.totalRows = result['pagedData']['totalRows'];
          this.totalPages = result['pagedData']['totalPages']
          this.dataSource.sort = this.sort;
        }
        else{
          this.notifier.notify('warning','No se encontraron registros de Usuarios');
        }

      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar obtener los Usuarios. Error: '+ result.statusText);
      }
    }, error => {
      this.notifier.notify(
        'error',
        'Ha ocurrido un error al intentar cargar los Usuarios. Error: ' + error
      );
    });
  }



  
  GetUsuariosByFilter() {
    this.usuarioObj = {
      apellido1: this.searchFilter.get('apellido1').value,
      apellido2: this.searchFilter.get('apellido2').value,
      nombre: this.searchFilter.get('nombre').value,
      sexo: this.searchFilter.get('sexo').value,
      rfc: this.searchFilter.get('rfc').value,
      curp: this.searchFilter.get('curp').value,
      celular: this.searchFilter.get('celular').value
    }

    this.usuarioSvc.GetByFilter(this.usuarioObj).subscribe( (result: UsuarioModel) => {
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.usuarios = result.data;
          this.dataSource = new MatTableDataSource<UsuarioModel>(this.usuarios);          
          this.dataSource.sort = this.sort;
        }
        else{
          this.notifier.notify('warning','No se encontraron registros de Usuarios');
        } 
      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar obtener los Usuarios. Error: '+ result.statusText);
      }

      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los Usuarios. Error: ' + error
        );
      }
    );
  }


  QuitarFiltros(){
    this.GetUsuarios(this._tam, this._pag);
    this.apellido1 = '';
    this.apellido2 = '';
    this.nombre = '';
    this.curp = '';
    this.sexo = '';
    this.rfc = '';
    this.celular = '';
    
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
          this.GetUsuarios(event.pageSize, 1);
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
      this.GetUsuarios(this.paginator.pageSize, this.paginator.pageIndex +1)
    }   
  }

  pageMenos() {
    if(this.paginator.pageIndex <= this._length){
      this.GetUsuarios(this.paginator.pageSize, this.paginator.pageIndex +1)
    }
    
  }

}
