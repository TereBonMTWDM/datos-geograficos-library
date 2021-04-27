import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { DatosGeograficosService } from '../datos-geograficos.service';

@Component({
  selector: 'dgtit-geo-curp',
  templateUrl: './curp.component.html',
  styleUrls: ['./curp.component.scss']
})
export class CurpComponent implements OnInit, OnChanges {
  @Input('curp') curpInput: any;
  @Output('onDatos') dataOutput = new EventEmitter<any>();
  
  public apellido1 = '';
  public apellido2 = '';
  public nombre = '';
  public sexoId = '';
  public estadoAbrev = '';
  public estadoId = '';
  //public fecha = '';
  public fecha:Date;
  public nacionalidadId = '';

  public estado = ' ';
  public sexo = '';
  public nacionalidad = '';

  public obj: any;
  public nombreCompleto:String;
  
  constructor(
    private geograficosSvc: DatosGeograficosService
  ) { }

  async ngOnChanges(changes: SimpleChanges){
    if(!!changes.curpInput && !!changes.curpInput.currentValue){
      this.apellido1 = changes.curpInput.currentValue["apellido1"];
      this.apellido2 = changes.curpInput.currentValue["apellido2"];
      this.nombre = changes.curpInput.currentValue["nombre"];

      this.nombreCompleto = this.apellido1 + ' ' + this.apellido2 + ' ' + this.nombre;

      this.sexoId = changes.curpInput.currentValue["sexo"];
      this.estadoAbrev = changes.curpInput.currentValue["estadoAbrevNac"];
      this.estadoId = changes.curpInput.currentValue["estadoCveNac"];
      this.fecha = changes.curpInput.currentValue["fechaNac"];
      this.nacionalidadId = changes.curpInput.currentValue["nacionalidad"];

      this.getSexo();
      this.getEstadoById();
      this.getNacionalidad();

      this.obj = {
        apellido1: this.apellido1,
        apellido2: this.apellido2,
        nombre: this.nombre,
        sexo: this.sexo,
        estado: this.estado,
        fecha: this.fecha,
        nacionalidad: this.nacionalidadId
      }
      this.dataOutput.emit(this.obj);
      
    }
  }
  ngOnInit() {}

   getEstadoById(){
     this.geograficosSvc.get('Estado').subscribe((result: any) => {
      result.forEach((element:any) => {
        if (element.id.toString().toLowerCase().trim() == this.estadoId.toString().toLowerCase().trim()){
          this.estado = element.nombre.toString();
          return;
        }
      });
    });
  }



  getSexo(){
    this.sexo = this.sexoId == '1' ? 'FEMENINO' : 'MASCULINO';
  }



  getNacionalidad(){
    this.nacionalidad = this.nacionalidadId == 'MEX' ? 'MEXICANA' : 'NACIONALIDAD EXTRANJERA';
  }
}
