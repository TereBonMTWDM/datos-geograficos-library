import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-domicilio',
  templateUrl: './test-domicilio.component.html',
  styles: []
})
export class TestDomicilioComponent implements OnInit {

  public domicilio:any = {};
    

  constructor() { }

  ngOnInit() {  
    // this.domicilio = {
    //   municipio: 'IRAPUATO',
    //   municipioId: '017',
    //   localidad: 'ARANDAS',
    //   zona: 'URBANO',
    //   cp: '36590',
    //   colonia: 'COLONIA VALLE DEL SOL',
    //   coloniaId: '3457',
    //   calle: 'CALLE AUSTRAL', 
    //   numExt: '111',
    //   numInt: '222',
    //   entre1: 'CALLE ATENEA',
    //   entre2: 'CALLE AUSTRAL'
    // }  
  }



  onDatosGeograficosByDomicilio(event: string){
    console.log(event);

  }

}
