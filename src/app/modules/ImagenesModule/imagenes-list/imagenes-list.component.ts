import { Component, OnInit } from '@angular/core';
import { AmazonModel } from 'src/app/models/AmazonModel';
import { AmazonService } from 'src/app/services/amazon.service';
import { NotifierService } from 'angular-notifier';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-imagenes-list',
  templateUrl: './imagenes-list.component.html',
  styleUrls: ['./imagenes-list.component.scss']
})
export class ImagenesListComponent implements OnInit {
  public archivos: AmazonModel[];
  selected: string = '';
  dataServiceSub;
  dataImage;
  contentType;
  bucket ='expedientessfia';
  imagelist= {
    "ListImagenes":
      [
        {
          "nombre": "aaa.jpg",
          "bucket": "expedientessfia"
        },
        {
          "nombre": "bbb.jpg",
          "bucket": "expedientessfia"
        },
        {
          "nombre": "ccc.jpg",
          "bucket": "expedientessfia"
        }
      ]
  }

  constructor(
    private amazonSvc: AmazonService,
    private notifier: NotifierService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.GetImagenes(this.imagelist);
  }

  GetImagenes(body){
    this.amazonSvc.GetImagesByList(body).subscribe( (result: AmazonModel) => {
      if(result.statusCode == 200){  
        if(result.data.length > 0){
          this.archivos = result.data;
        }
        else{
          this.notifier.notify('warning','No se encontraron registros de las imágenes');
        }
      }
      else{
        this.notifier.notify('error','Ocurrió un error al intentar obtener información de las imágenes. Error: '+ result.statusText);
        
      }
    }, error => {
        this.notifier.notify(
          'error',
          'Ocurrió un error al intentar obtener información'
        );
      this.notifier.notify('warning','Ocurrió un error al intentar obtener información. Error: ' + error.statusText);
    });
  }

    downloadFileBase64(){
      let formatoArray = this.selected.split('.');
      //let nombreArray = this.selected.split('/');
      let formato = formatoArray[formatoArray.length - 1]
      //let nombre = nombreArray[nombreArray.length - 1]
      if (formato == 'pdf' || formato =='PDF'){
        this.contentType = 'application/pdf'
      }else{
        this.contentType='image/*'
      }
      this.dataServiceSub = this.amazonSvc.getImageBase64(this.selected,this.bucket).subscribe(
          data => {
            if (data['data'] && data['data'].length > 0) {
              this.dataImage = data['data'][0]['base64'];
              /*Proceso de construccion de base64 a blob */
                let sliceSize = 512;
                let byteCharacters = atob(this.dataImage);
                let byteArrays = [];
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  let slice = byteCharacters.slice(offset, offset + sliceSize);
                  let byteNumbers = new Array(slice.length);
                  for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }
                  let byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }
                /*Proceso de descarga de archivo*/
                let downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(byteArrays, { type: this.contentType }));
                downloadLink.setAttribute('download', this.selected);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                downloadLink.parentNode.removeChild(downloadLink);
            }
          },
          error => {
            this.notifier.notify(
              'error',
              'Ha ocurrido un error al descargar la imagen.'
            );
          }
        );
    }

  selectItem(value: string) {
    this.selected = value;

    let formatoArray = this.selected.split('.');
    //let nombreArray = this.selected.split('/');
    let formato = formatoArray[formatoArray.length - 1]
    //let nombre = nombreArray[nombreArray.length - 1]
    if (formato == 'pdf' || formato == 'PDF') {
      this.contentType = 'application/pdf'
    } else {
      this.contentType = 'image/*'
    }
    this.dataServiceSub = this.amazonSvc.getImageBase64(this.selected, this.bucket).subscribe(
      data => {
        
        if(data['statusCode']==500){
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al visualizar la imagen. Contacte con el Administrador.'
          );
          console.log(data['statusText']);
        }else{
          if (data['data'] && data['data'].length > 0) {
          this.dataImage = data['data'][0]['base64'];
          /*Proceso de construccion de base64 a blob */
          let sliceSize = 512;
          let byteCharacters = atob(this.dataImage);
          let byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          if (formato == 'pdf' || formato == 'PDF') {
            let downloadLinkPDF = document.getElementById("pdfView");
            downloadLinkPDF['src'] = window.URL.createObjectURL(new Blob(byteArrays, { type: this.contentType }));
            // let downloadLinkPDFA = document.getElementById("pdfViewA");
            // downloadLinkPDFA['href'] = window.URL.createObjectURL(new Blob(byteArrays, { type: this.contentType }));
          }else{
             /*Proceso de visualización de archivo img*/
          let downloadLink = document.getElementById("imgView");
          downloadLink['src'] = window.URL.createObjectURL(new Blob(byteArrays, { type: this.contentType }));
              }
          } 
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al visualizar la imagen.'
        );
      }
    );
  }



  

}


