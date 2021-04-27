import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatIconModule, MatButtonModule } from '@angular/material';
import * as XLSX from 'xlsx';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MatTable } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmacionComponent } from "../../../../components/confirmacion/confirmacion.component";
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { NgForage } from 'ngforage';
import { catalogoArchivosService } from "../../../../services/Admin/catalogoArchivos.service";
import { i_catalogoArchivo } from 'src/app/interfaces/interfaces';
import { ArchivosActionsComponent } from '../archivos-actions/archivos-actions.component';


@Component({
  selector: 'app-archivos-list',
  templateUrl: './archivos-list.component.html',
  styleUrls: ['./archivos-list.component.scss']
})
export class ArchivosListComponent implements OnInit {
  totalRows: number;
  totalPages: number;
  pageEvent: PageEvent;
  pageSizeOptions;
  _tam;
  _pag;
  _length;

  dataUser;
  searchFilter;
  dataSubs
  tablaMenus: i_catalogoArchivo[];
  dataSource=null;
  valueName;
  valueDesc;
  displayedColumns: string[] = [
    "descripcion",
    "extension",
    'actions'
  ];
  dataExcel;
  thisUrl;
  tituloPage;
  dataMenuActual;
  borrar;


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) exportTable: ElementRef;

  @ViewChild(MatTable, { static: false }) Table: MatTable<any>;


  constructor(
    private dataService: catalogoArchivosService,
    private notifier: NotifierService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private store: NgForage,)
    {
    this.searchFilter = this.formBuilder.group({
      descripcion: ''
    });
    }

  async ngOnInit() {
    this.dataUser = await this.store.getItem('usrCitas');
    this.pageSizeOptions = [10, 20, 30];
    this._tam = this.pageSizeOptions[0];
    this._pag = 1;


    this.getData(this._tam, this._pag)
    this.searchFilter = new FormGroup({
      descripcion: new FormControl(''),
    });
  }


  getData(tam: number, pag: number) {
    if (tam == 0 && pag == 0) {
      tam = this._tam;
      pag = this._pag + 1;
    }
    this.dataSubs = this.dataService.getCatalogo(tam, pag).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.tablaMenus = data['data'];
          //this.totalRows = data['pagedData']['totalRows'];
          //this.totalPages = data['pagedData']['totalPages']
          this.totalRows=3;
          this.totalPages=2;
          this.dataSource = new MatTableDataSource<i_catalogoArchivo>(this.tablaMenus);
          this.dataSource.sort = this.sort;
          this.valueName = '';
          this.valueDesc = '';
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

  pageMas() {
    if (this.paginator.pageIndex == 0) {
      this.paginator.pageIndex++;
    }

    if (this.paginator.pageIndex <= this._length) {
      this.getData(this.paginator.pageSize, this.paginator.pageIndex + 1)
    }
  }

  pageMenos() {
    if (this.paginator.pageIndex <= this._length) {
      this.getData(this.paginator.pageSize, this.paginator.pageIndex + 1)
    } 
  }

  QuitarFiltros(){
    this.getData(this._tam, this._pag);
  }

  ExportTOExcel() {
    this.dataExcel = this.dataSource.data;
    this.dataExcel = this.dataExcel.map(data => ({
      Texto: data.descripcion,
      Formato:data.extension
    }));
    const workSheet = XLSX.utils.json_to_sheet(this.dataExcel);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    workSheet['A1'].S = { 'bold': true };
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Menus1');
    XLSX.writeFile(workBook, 'Archivos_Listado.xlsx');

  }

  getDataMenuActual() {
    this.thisUrl = window.location.href;
    this.tituloPage = this.thisUrl.split('#', 2);
    this.dataSubs = this.dataService.getMenusActual(this.tituloPage[1]).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.dataMenuActual = data['data'][0];
        }
      },
      error => { }
    );
  };

  openDialogAccionUrs(accion, obj): void {
    obj.action = accion;
    const dialogRefEliminar = this.dialog.open(ConfirmacionComponent, {
      width: '360px',
      height: '220px',
      data: obj
    }).afterClosed().subscribe(result => {
      this.borrar = result;
      if (this.borrar == true) {
        this.borrarMenu(obj.tipoArchivoID)
      }
    });
  }


  borrarMenu(idArchivo) {
    this.dataService.deleteArchivo(idArchivo, this.dataUser['idx']).subscribe(
      data => {
        if (data['statusCode'] == 500) {
          this.notifier.notify(
            'error',
            data['errorMessage']
          );
        } else {
          this.getData(this._tam, this._pag)
          this.notifier.notify(
            'success',
            'Tipo de archivo borrado exitosamente!'
          );
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Contacta con el administrador'
        );
      }
    );
  }


  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(ArchivosActionsComponent, {
      width: '500px',
      height: '320px',
      data: obj
    }).afterClosed().subscribe(response => {
      try {
        if (response.sucess == true && obj.action == 'Agregar') {
          this.getData(this._tam, this._pag);
          this.notifier.notify(
            'success',
            'tipo de archivo guardado correctamente.'
          );
        } else if (response.sucess == true && obj.action == 'Actualizar') {
          this.getData(this._tam, this._pag);
          this.notifier.notify(
            'success',
            'tipo de archivo actualizado correctamente.'
          );
        } else if (response.success == false) {
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
          );
        }
        this.getData(0, 0)
        //this.getData(this._tam, this._pag)
      } catch{ }
    });

  }



}
