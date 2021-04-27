import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccesibilidadService } from 'src/app/services/base/accesibilidad.service';

@Component({
  selector: 'dgtit-accesibilidad',
  templateUrl: './accesibilidad.component.html',
  styleUrls: ['./accesibilidad.component.scss']
})
export class AccesibilidadComponent implements OnInit {
  @Input() isShowed: boolean
  @Output()
  closePanel = new EventEmitter<boolean>()
  
  constructor(public accesibilidadService : AccesibilidadService) { }

  ngOnInit() {
  }

  toogleScreenReader(): void{
    !this.accesibilidadService.isActive ? this.accesibilidadService.activateScreenReader() : this.accesibilidadService.deactivateScreenReader()
  }

  onCloseAccesibilidad(){
    this.closePanel.emit(true)
  }
  

}
