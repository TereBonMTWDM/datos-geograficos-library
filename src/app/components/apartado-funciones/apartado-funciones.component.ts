import { Component, OnInit, Input,  } from '@angular/core';

@Component({
  selector: 'dgtit-apartado-funciones',
  templateUrl: './apartado-funciones.component.html',
  styleUrls: ['./apartado-funciones.component.scss']
})
export class ApartadoFuncionesComponent implements OnInit {
  @Input() contactoItems :any 
  
  //showAccessibility: boolean = false
  constructor() { }

  ngOnInit() {
  }

  // toogleAccessibilityOptionsMenu(){
  //   this.showAccessibility = !this.showAccessibility ? true : false
  // }

  // onClosePanel(e:boolean){
  //   e  ? this.toogleAccessibilityOptionsMenu() : ''
  // }
}
