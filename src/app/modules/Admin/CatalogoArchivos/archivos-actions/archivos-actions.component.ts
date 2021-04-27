import { Component, OnInit, Inject, Optional, ViewChild, ElementRef, SimpleChanges, ɵConsole } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource, MatSort, MatTable, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { NgForage } from 'ngforage';
import { catalogoArchivosService } from "../../../../services/Admin/catalogoArchivos.service";


@Component({
  selector: 'app-archivos-actions',
  templateUrl: './archivos-actions.component.html',
  styleUrls: ['./archivos-actions.component.scss']
})
export class ArchivosActionsComponent implements OnInit {
  formCatalogoArchivos;
  dataUser;
  constructor(
    private dataService: catalogoArchivosService,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private store: NgForage,
    public dialogRef: MatDialogRef<ArchivosActionsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) 
    private dataModal: any) {
    this.formCatalogoArchivos = this.formBuilder.group({
      descripcion: '',
      extension: ''
    });
   }
  public hasError = (controlName: string, errorName: string) => {
    return this.formCatalogoArchivos.controls[controlName].hasError(errorName);
  }
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async ngOnInit() {
    this.dataUser = await this.store.getItem('usrCitas');
    this.formCatalogoArchivos = new FormGroup({
      descripcion: new FormControl(this.dataModal.descripcion, [Validators.required, Validators.maxLength(100)]),
      extension: new FormControl(this.dataModal.extension, [Validators.required])
    });
  }

  saveData(){
    this.formCatalogoArchivos.value.UsuarioID = this.dataUser.idx;
    if (this.dataModal.action=="Actualizar"){
      this.dataService.putData(this.formCatalogoArchivos.value, this.dataModal.tipoArchivoID).subscribe(result => {
        if (result['statusCode']==201){
          this.dialogRef.close({ sucess: true });
        }else{
          this.dialogRef.close({ sucess: false });
        }
        },
        error => {
          console.log(error);
          this.dialogRef.close({ sucess: false });
        });
    } else if (this.dataModal.action == "Agregar"){
      this.dataService.postData(this.formCatalogoArchivos.value).subscribe(result=>{
        if (result['statusCode'] == 201) {
          this.dialogRef.close({ sucess: true });
        } else {
          this.dialogRef.close({ sucess: false });
        }
      },
      error=>{
        console.log(error);
        this.dialogRef.close({ sucess: false });
      });
    }
  }

}
