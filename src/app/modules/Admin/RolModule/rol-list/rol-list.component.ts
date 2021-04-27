import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { i_lrol } from 'src/app/interfaces/interfaces';
import { RolService } from 'src/app/services/Admin/roles.service';
import { RolDialogComponent } from '../rol-dialog/rol-dialog.component';
import { RolModel, RolMenuModel } from 'src/app/models/RolModel';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatTable } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MenuService } from 'src/app/services/Admin/menu.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmacionComponent } from "../../../../components/confirmacion/confirmacion.component";
import { Router } from '@angular/router';
import { NgForage } from 'ngforage';


@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.scss']
})
export class RolListComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<i_lrol>;  
  @Input() totalrows: number;
  @Input('accionDialog') status: string;
  @Output() bandera = new EventEmitter<boolean>();

  public rolById: RolModel[] = [];
  public rol: RolModel;
  tablaMenus: i_lrol[];
  // totalrows: number;
  totalpages: number;
  searchFilter;
  count = 1;
  thisUrl;
  tituloPage;
  acceso;
  borrar;
  dataUser;

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
    public dialog: MatDialog,
    private notifier: NotifierService,
    private fb: FormBuilder,
    
    private authService: AuthService,
    private router: Router,
    private store: NgForage, 
  ) {
    this.searchFilter = this.fb.group({
      descripcion: ''
    });
  }

  async ngOnInit() {
    this.dataUser = await this.store.getItem('usrCitas');
    this.searchFilter = new FormGroup({
      descripcion: new FormControl(''),
    });

  }




  openDialog(action, obj) {
    obj.action = action;

    if(action == 'Agregar'){
      const dialogRef = this.dialog.open(RolDialogComponent, {
        width: '830px',
        height: '720px',
        // data: this.rol
        data: obj
      }).afterClosed().subscribe(response => {
        if (response) {
          if (response.sucess == true && obj.action == 'Agregar') {
            // this.getData();
            this.banderaCambio();
            this.notifier.notify(
              'success',
              'Roles guardados correctamente.'
            );         
          } else if (response.success == false) {
            this.notifier.notify(
              'error',
              'Ocurrió un error al intentar guardar el Rol. Favor de contactar al administrador.'
            );
          }
        }
        else {
          // this.getData();
          this.banderaCambio();
        }
      }); 
    }else {
      // Editar
      this.rolSvc.getRolById(obj.rolID).subscribe( (result: RolModel) => {
          this.rol = result.data[0];
          this.rol.action = action;

          const dialogRef = this.dialog.open(RolDialogComponent, {
            width: '830px',
            height: '720px',
            data: this.rol
            // data: obj
          }).afterClosed().subscribe(response => {
            if (response) {
              if (obj.action == 'Actualizar') {
                // this.getData();
                this.banderaCambio();

                this.notifier.notify(
                  'success',
                  'Roles actualizados correctamente.'
                );
              } else if (response.success == false) {
                this.notifier.notify(
                  'error',
                  'Ocurrió un error al intentar obtener los Roles. Favor de contactar al administrador.'
                );
              }
            }
            else {
              // this.getData();
              this.banderaCambio();
            }
          });      
        });
    }
  }

  openDialogAccionUrs(accion, obj): void {
    obj.action = accion;
    const dialogRefEliminar = this.dialog.open(ConfirmacionComponent, {
      width: '300px',
      height: '230px',
      data: obj
    }).afterClosed().subscribe(result => {
      (result);
      this.borrar = result;
      if (this.borrar == true) {
        //this.borrarMenu(obj.menuID)
        this.borrarRol(obj.rolID)
      }
    });
  }


  /*
  getData() {
    this.rolSvc.getRols().subscribe((result: RolModel) => {  
      if(result.statusCode == 200){
        if(result.data.length > 0){
          this.tablaMenus = result['data'];
          this.dataSource = new MatTableDataSource<i_lrol>(this.tablaMenus);
          this.totalrows = result['pagedData']['totalRows'];
          this.totalpages = result['pagedData']['totalPages']
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
      this.notifier.notify('error','Ocurrió un error al intentar obtener los Roles. Error: ' + error);
    });
  };
  */





  borrarRol(rolID) {
    this.rolSvc.deleteRol(rolID, this.dataUser).subscribe((result: RolModel) => {
      if(result.statusCode == 201){
        //this.getData();
        this.banderaCambio();
        this.notifier.notify('success','Rol eliminado correctamente.');
      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar eliminar el Rol. Error: '+ result.statusText);
      }
    },
    error => {
      this.notifier.notify('error','Ocurrió un error al intentar eliminar el Rol. Error: '+ error);
    });
  }

  banderaCambio(){
    this.bandera.emit(true);
  }
}
