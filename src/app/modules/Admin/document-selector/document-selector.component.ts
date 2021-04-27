import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { TramiteService } from 'src/app/services/Admin/tramite.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-document-selector',
  templateUrl: './document-selector.component.html',
  styleUrls: ['./document-selector.component.scss'],
  providers: [TramiteService]
})
export class DocumentSelectorComponent implements OnInit {
  doc: any;
  documentStep=new FormGroup({
    document: new FormControl(),
    requieredCheck: new FormControl()
  });
  constructor(private _formBuilder: FormBuilder, private dataService: TramiteService) { }

  ngOnInit() {
    this.getDocument();
    this.documentStep = this._formBuilder.group({
      document: ['', Validators.required],
      requieredCheck: [''],
    });
    this.onDisabledAll();
  }

onDisabledAll(){
  // for (var _i = 1; _i <= 15; _i++) {
  //   console.log(_i);
  // }
}
  onCheckboxChanges(param){
    let x = document.querySelector("#document_" + param + "-input");
    if ((<HTMLInputElement>x).checked == true) {
      (<HTMLInputElement>document.getElementById("requiered_" + param + "-input")).disabled = false;
    }else{
      (<HTMLInputElement>document.getElementById("requiered_" + param + "-input")).disabled = true;
    }
  }

  saveDocuments() {
    let cantDoc = this.doc.length;
    let Documento = new Array();
    let Docum = new Object();
    let docReq = new Array();
    for (var i = 1; i <= cantDoc; i++) {
      let x = document.querySelector("#document_" + i + "-input");
      let y = document.querySelector("#requiered_" + i + "-input");
      if ((<HTMLInputElement>x).checked == true) {
        Documento.push(parseInt((<HTMLInputElement>x).value));
        if ((<HTMLInputElement>y).checked == true) {
          docReq.push(parseInt((<HTMLInputElement>y).value));
        }
        Docum['documento'] = Documento;
        Docum['requ'] = docReq;
      }
    }
    console.log(Docum);
    //alert(Docum);
    // this.dataService.addDocument(this.tercerFormGroup).subscribe(
    //         result => {
    //           // Handle result
    //         },
    //         error => {
    //           console.log(error);
    //         }
    //       );
  }

  getDocument() {
    this.dataService.getDocumentos().subscribe(
      datos => {
        if (datos['data'] && datos['data'].length > 0) {
          this.doc = datos['data'];
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
