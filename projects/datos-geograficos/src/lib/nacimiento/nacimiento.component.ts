import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatPaginator,MatDialog,MatDialogRef, MatTableDataSource, MatSort, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatAutocomplete, MatTable } from '@angular/material';
import { DatosGeograficosController } from '../datos-geograficos.controller';
import { DatosNacimiento } from '../datos-geograficos.model';
import { DatosGeograficosService } from '../datos-geograficos.service';

@Component({
  selector: 'dgtit-geo-nacimiento',
  templateUrl: './nacimiento.component.html',
  styles: []
})
export class NacimientoComponent implements OnInit, OnChanges {
  @Input('nacimiento') nacimientoInput: any;
  @Output('onSelect') dataSalida = new EventEmitter<any>();

  show: boolean = true;
  public Pais = '';
  public Estado = '';
  public Municipio = '';
  public Localidad = '';

  public muniSelect: string;
  public localSelect;
  public estadoSelectedId: string;
  public municipioSelectedId: string;

  public obj: any;

  constructor(
    private geograficosSvc: DatosGeograficosService,
    private dgCtrl: DatosGeograficosController
  ) { }

  async ngOnChanges(changes: SimpleChanges){
    if(!!changes.nacimientoInput && !!changes.nacimientoInput.currentValue){
      this.Pais = changes.nacimientoInput.currentValue["pais"];
      
      if(this.Pais == 'MÉXICO'){
        this.Estado = changes.nacimientoInput.currentValue["estado"];
        await this.getEstadoID(this.Estado);

        this.muniSelect = changes.nacimientoInput.currentValue["municipio"];
        this.localSelect = changes.nacimientoInput.currentValue["localidad"];
      }
    }
  }

  ngOnInit() {
  }

  getEstadoID(nombre: string): any {
    this.geograficosSvc.get('Estado').subscribe((result: any) => {
      result.forEach(element => {
        if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toLowerCase().trim())){
          this.estadoSelectedId = element.id.toString();
          this.Municipio = this.muniSelect;
          this.getMunicipioID(this.Municipio);

          return element.id.toString();
        }
      });
    });
  }

  getMunicipioID(nombre: string){
    if(this.estadoSelectedId != null){
      this.geograficosSvc.get('Municipio', this.estadoSelectedId).subscribe((result: any) => {
        result.forEach(element => {
          if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toLowerCase().trim())){
            this.municipioSelectedId = element.id.toString();
            this.Localidad = this.localSelect;
  
            return;
          }
        });
      });

    }
  }


 

  filtrar_acentos(input: string) {
    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
    
    for (var i = 0; i < acentos.length; i++) {
      input = input.replace(acentos.charAt(i), original.charAt(i)).toLowerCase();
    };
    
    return input;
  }

  onDatosGeograficos(event: string, model: string){
    switch(model){
      case "Pais":

        if(event["nombre"] != 'MÉXICO'){
          this.show = false;
          this.Estado = '';
        }
        else{
          this.show = true;
        }

        this.Pais = event["nombre"];
        break;

      case "Estado":
        this.Estado = event["nombre"];

        if(this.Municipio == ''){ 
          this.Municipio = '';
          this.estadoSelectedId = event["id"];
        }
        else{
          this.Municipio = '';
          this.Localidad = '';
        }
        break;

      case "Municipio":
        this.Municipio = event["nombre"];
        
        this.Localidad = ' ';
        if(this.Localidad = ' '){
          this.municipioSelectedId = event["id"];
          this.Localidad = '';
        }
        else{
          this.Localidad = ' ';
        }
        break;

      case "Localidad":
        this.Localidad = event["nombre"];

        this.obj = {
          pais: this.Pais,
          estado: this.Estado,
          municipio: this.Municipio,
          localidad: this.Localidad
        }

        this.dataSalida.emit(this.obj);
        break;
    }

  }
}
