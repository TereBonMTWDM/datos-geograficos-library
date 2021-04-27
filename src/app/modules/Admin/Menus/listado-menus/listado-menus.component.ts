import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatIconModule, MatButtonModule } from '@angular/material';
import * as XLSX from 'xlsx';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MatTable } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { i_lmenu } from "../../../../interfaces/interfaces";
import { MenuService } from "../../../../services/Admin/menu.service";
import { HomePageComponent } from '../../../../components/pages/home-page/home-page.component';
import { MenusActionsComponent } from '../menus-actions/menus-actions.component';
import { TargetLocator } from 'selenium-webdriver';
import { ConfirmacionComponent } from "../../../../components/confirmacion/confirmacion.component";
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { NgForage } from 'ngforage';


@Component({
  selector: 'app-listado-menus',
  templateUrl: './listado-menus.component.html',
  styleUrls: ['./listado-menus.component.scss']
})
export class ListadoMenusComponent implements OnInit {
  totalRows: number;
  totalPages: number;
  pageEvent: PageEvent;
  pageSizeOptions;
  _tam;
  _pag;
  _length;


  tablaMenus: i_lmenu[];
  dataSource = null;
  count = 1;
  borrar;
  valueName = '';
  valueDesc = '';
  dataExcel;
  tituloPage;
  dataMenuActual;
  thisUrl;
  dataUser;
  acceso = false;
  dataSubs;
  idMenu: number;
  searchFilter;
  displayedColumns: string[] = [
    "texto",
    "descripcion",
    "roles",
    'actions'
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) exportTable: ElementRef;

  @ViewChild(MatTable, { static: false }) Table: MatTable<any>;

  constructor(private authService: AuthService,
    private dataService: MenuService, 
    private notifier: NotifierService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: NgForage, 
    private router: Router) {
      this.searchFilter = this.formBuilder.group({
        texto: '',
        descripcion: ''
      });
     }

  async ngOnInit() {
    this.dataUser = await this.store.getItem('usrCitas');
    this.pageSizeOptions = [10,20,30];
    this._tam = this.pageSizeOptions[0];
    this._pag = 1;


    this.getData(this._tam, this._pag)
    this.searchFilter = new FormGroup({
      texto: new FormControl(''),
      descripcion: new FormControl(''),
    });

  }
  

  getData(tam: number, pag: number) {
    if(tam == 0 && pag == 0){
      tam = this._tam;
      pag = this._pag + 1;
    }
    this.dataSubs=this.dataService.Get(tam, pag).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.tablaMenus = data['data'];
          this.totalRows = data['pagedData']['totalRows'];
          this.totalPages = data['pagedData']['totalPages']
          this.dataSource = new MatTableDataSource<i_lmenu>(this.tablaMenus);
          // this.dataSource.paginator = this.paginator;
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




  getDataMenuActual() {
    this.thisUrl = window.location.href;
    this.tituloPage = this.thisUrl.split('#', 2);
    this.dataSubs =this.dataService.getMenusActual(this.tituloPage[1]).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.dataMenuActual = data['data'][0];
        }
      },
      error => {}
    );
  };

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(MenusActionsComponent, {
      width: '830px',
      height: '720px',
      data: obj
    }).afterClosed().subscribe(response => {
      try{
        if (response.sucess == true && obj.action == 'Agregar') {
          this.getData(this._tam, this._pag);
          this.notifier.notify(
            'success',
            'Menú guardado correctamente.'
          );
        } else if (obj.action == 'Actualizar') {
          this.getData(this._tam, this._pag);
        } else if (response.success == false) {
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
          );
        }
        this.getData(0,0)
        //this.getData(this._tam, this._pag)
      }catch{}
    });

  }

  openDialogAccionUrs(accion,obj): void {
    obj.action = accion;
    const dialogRefEliminar = this.dialog.open(ConfirmacionComponent, {
      width: '360px',
      height: '220px',
      data: obj
    }).afterClosed().subscribe(result => {
      this.borrar = result;
      if(this.borrar==true){
        this.borrarMenu(obj.menuID)
      }
    });
  }




 

  getDataByFilter() {
    const texto = this.searchFilter.get('texto').value
    const descripcion = this.searchFilter.get('descripcion').value
    this.dataSubs = this.dataService.getMenuFilter(texto, descripcion).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {
          this.tablaMenus = data['data'];
          this.dataSource = new MatTableDataSource<i_lmenu>(this.tablaMenus);
          //this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  

  borrarMenu(idMenu) {
    this.dataService.deleteMenu(idMenu, this.dataUser).subscribe(
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
            'Menú borrado exitosamente!'
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

  ngAfterViewInit() {
    this.getDataMenuActual()
    let bttnclick = document.getElementsByClassName("mat-paginator-navigation-next");
    (bttnclick[0]).addEventListener("click", () => this.pageMas())
    let bttnclickmenos = document.getElementsByClassName("mat-paginator-navigation-previous ");
    (bttnclickmenos[0]).addEventListener("click", () => this.pageMenos())

    this.paginator.page.subscribe(
      (event) => {
        this._length = event.length;

        if(this._tam != event.pageSize){
          //sólo si se hace cambio de tamaño de página:
          this.getData(event.pageSize, 1);
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
      this.getData(this.paginator.pageSize, this.paginator.pageIndex +1)
    }   
  }

  pageMenos() {
    if(this.paginator.pageIndex <= this._length){
      this.getData(this.paginator.pageSize, this.paginator.pageIndex +1)
    }
    
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  QuitarFiltros(){
    this.getData(this._tam, this._pag);
  }

  ngOnDestroy(): void {
    this.dataSubs.unsubscribe();
  }

  ExportTOExcel() {
          this.dataExcel = this.dataSource.data;
          this.dataExcel = this.dataExcel.map(data=>({
          Texto: data.texto,
          Descripcion: data.descripcion,
          Roles:data.roles,
          Target:data.target,
          HREF:data.href,
          Público: (data.publico == true) ? data.publico = "Si" : data.publico = "No",
          //Externo: (data.externo == true) ? data.externo = "Si" : data.externo = "No",
          Posicion:data.posicion
         }));
        const workSheet = XLSX.utils.json_to_sheet(this.dataExcel);
        const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    workSheet['A1'].S = { 'bold': true };
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Menus1');
        XLSX.writeFile(workBook, 'Menus_Listado.xlsx');

  }

}
