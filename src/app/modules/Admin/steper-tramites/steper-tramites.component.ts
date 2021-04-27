import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DocumentSelectorComponent } from '../document-selector/document-selector.component';

@Component({
  selector: 'app-steper-tramites',
  templateUrl: './steper-tramites.component.html',
  styleUrls: ['./steper-tramites.component.scss'],
  
})
export class SteperTramitesComponent implements OnInit {
  doc: any;
  constructor() { }
  @ViewChild(DocumentSelectorComponent, { static: true } ) documentos:DocumentSelectorComponent;
  ngOnInit() {

  }

  saveDocument() {
    this.documentos.saveDocuments();
    }
  
}
