import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-curp',
  templateUrl: './test-curp.component.html',
  styles: []
})
export class TestCurpComponent implements OnInit {
  public curp:any;
  

  constructor() { }

  ngOnInit() {
    this.curp = {
      apellido1: 'OROZCO',
      apellido2: 'BON',
      nombre: 'TERESA MARGARTIA',
      sexo: '1',
      estadoAbrevNac: 'SIN',
      estadoCveNac: 25,
      fechaNac: '1984-01-17',
      nacionalidad: 'MEX'
    }
  }

}
