import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from 'src/app/services/Admin/menu.service';
import { MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { AmazonModel } from 'src/app/models/AmazonModel';
import { AmazonService } from 'src/app/services/amazon.service';
import { NotifierService } from 'angular-notifier';
import { HttpClient } from '@angular/common/http';
import { ImagenUploadComponent } from '../imagen-upload/imagen-upload.component';


@Component({
  selector: 'app-imagenes-module',
  templateUrl: './imagenes-module.component.html',
  styleUrls: ['./imagenes-module.component.scss']
})
export class ImagenesModuleComponent implements OnInit {
  @Input('actionDialog') status: string;
  public archivos: AmazonModel[];
  selected: string = '';
  bucket = 'expedientessfia';
  

   /* #region  #Title */
   dataMenuActual;
   thisUrl;
   tituloPage;
   /* #endregion */

  constructor(
    private menuSvc: MenuService,
    private amazonSvc: AmazonService,
    private notifier: NotifierService,
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getDataMenuActual();
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

  uploadDocs(){
    const dialogRef = this.dialog.open(ImagenUploadComponent, {
      width: '700px', height: '600px',
      data: this.bucket
    }).afterClosed().subscribe(response => {
      try {
        if (response.sucess == true) {
          this.notifier.notify(
            'success',
            'Datos anexos guardados correctamente.'
          );
        } else if (response.sucess == false) {
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar guardar. Contacta al administrador.'
          );
        }

      } catch (error) {
        console.log(error);
      }
    })
  }
  

}
