import { Component, OnInit, Inject, Optional, ViewChild, ElementRef, SimpleChanges, ɵConsole } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource, MatSort, MatTable, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss']
})
export class ConfirmacionComponent implements OnInit {

  constructor(public dialogRefEliminar: MatDialogRef<ConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRefEliminar.close();
  }

}
