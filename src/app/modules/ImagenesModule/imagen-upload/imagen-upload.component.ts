import { Component, OnInit, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { uploadService } from '../../../services/Admin/uploadImage.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from "rxjs";
import { HttpEventType } from '@angular/common/http';
import { AnexoService } from '../../../services/Admin/anexos.service';
import { UsuariosService } from '../../../services/Admin/usuarios.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-imagen-upload',
  templateUrl: './imagen-upload.component.html',
  styleUrls: ['./imagen-upload.component.scss']
})

export class ImagenUploadComponent implements OnInit {
  progressSource: BehaviorSubject<any>;
  @ViewChild('fileInput', { static: false })
  fileInput;
  formUpload;
  progreso;
  formato;
  bodyImagex64;
  base64;

  file: File | null = null;

  async onClickFileInputButton() {
    this.progressSource.next(0);
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    console.log(this.file);
    if (this.file){
      let formatoArray = files[0].name.split('.');
      this.formato = (formatoArray[formatoArray.length - 1]).toString().toUpperCase();
    }
    if ((this.formato != 'PNG') && (this.formato != 'PDF') && (this.formato != 'JPEG') && (this.formato != 'JPG')){
      this.file = undefined;
      this.notifier.notify(
        'warning',
        'El formato del archivo seleccionado no es permitido'
      );
    }
  }

  quitaArchivo(){
    this.file=undefined
  }

  constructor(public dialogRef: MatDialogRef<ImagenUploadComponent>, private dataServiceAnexos: AnexoService, private notifier: NotifierService, private imageService: uploadService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    this.progressSource = new BehaviorSubject<number>(0);
    this.formUpload = this.formBuilder.group({
      documentUpload: ''
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async ngOnInit() {
    console.log(this.data);
    this.progressSource.next(0);
    this.formUpload = new FormGroup({
      documentUpload: new FormControl('')
    });
    this.progressSource.subscribe(
      result => {
        this.progreso = result;
      }
    );
  }



  
// async uploadImage(fileName){
//   this.progressSource.next(0);
//   var formData = new FormData();
//   formData.append('file', this.file,fileName);
//   this.imageService.uploadImage(formData, this.data.bucket).subscribe(
//     result => {
//       if (result['statusCode'] == 500) {
//           this.progressSource.next(0);
//           this.dialogRef.close({ sucess: false });
//       } 
//       if (result['statusCode'] == 200){
//         setTimeout(() => {
//           this.dialogRef.close({ sucess: true, tipo: this.formato });
//         }, 700);
//       }
//       if (result['progreso']){
//         this.progressSource.next(result['progreso']);
//       }
//       this.file = undefined
//     },
//     error => {
//       this.progressSource.next(0);
//       console.log(error);
//       this.file=undefined
//       this.notifier.notify(
//       'error',
//       'Ha ocurrido un error al intentar guardar la imagen: ' +error.error
//       );
//     }
//   );
  
// }

  async uploadImage(fileName) {
    this.progressSource.next(0);

    var formData = new FormData();
    formData.append('file', this.file, fileName);
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    var fileX64 = await toBase64(this.file)
    this.base64 = (""+fileX64+"").split(",");
    this.bodyImagex64={
      nombre:fileName,
      base64: this.base64[1]
    }
    this.imageService.uploadImageX64(this.bodyImagex64, this.data).subscribe(
      result => {
        console.log(result);
        if (result['statusCode'] == 500) {
          setTimeout(() => {
            this.progressSource.next(0);
          this.dialogRef.close({ sucess: false });
          }, 700);
        }
        if ((result['statusCode'] == 200) || (result['statusCode'] == 201)) {
          setTimeout(() => {
            this.dialogRef.close({ sucess: true, tipo: this.formato });
          }, 700);
        }
        if (result['progreso']) {
          this.progressSource.next(result['progreso']);
        }
        this.file = undefined
      },
      error => {
        this.progressSource.next(0);
        console.log(error);
        this.file = undefined
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar guardar la imagen: ' + error.error
        );
      }
    );

  }

ngOnDestroy() {
  this.progressSource.unsubscribe();
}

}
