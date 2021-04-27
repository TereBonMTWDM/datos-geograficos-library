import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { DatosGeograficosController } from '../datos-geograficos.controller';
import { DatosGeograficosService } from '../datos-geograficos.service';
import { FormControl } from '@angular/forms';
import { localeData } from 'moment';


@Component({
  selector: 'dgtit-geo-domicilio',
  templateUrl: './domicilio.component.html',
  styles: []
})
export class DomicilioComponent implements OnInit {
  @Input('domicilio') domicilioInput: any;
  @Output('onSelect') dataOutput = new EventEmitter<any>();
  
  show: boolean = true;
  public Pais = '';
  public PaisId: '';
  public Estado = '';
  public EstadoId = '';
  public Municipio = '';
  public MunicipioId = '';
  public Localidad = '';
  public LocalidadId = '';
  public Zona = '';
  public CP = '';
  public Colonia = '';
  public ColoniaId = '';
  public Calle = '';
  public CalleId = '';
  public NumExt = '';
  public NumInt = '';
  public Entre1 = '';
  public Entre2 = '';
  
  public muniSelect: string;
  public localSelect: string;

  public estadoSelectedId: string;
  public municipioSelectedId: string;
  public coloniaSelectedId: string;

  public obj: any;
  public colonias:any = [];
  public objColonias: any;
  
  //public showColonia: boolean = false;
  public otraColonia:string = '';
  public otraCalle:string = '';

  constructor(
    private geograficosSvc: DatosGeograficosService
  ) { }

  async ngOnChanges(changes: SimpleChanges){    
    if(!!changes.domicilioInput && !!changes.domicilioInput.currentValue){

      this.Pais = changes.domicilioInput.currentValue["pais"];
      
      if(this.Pais == 'MÉXICO'){
        this.Estado = changes.domicilioInput.currentValue["estado"];
        await this.getEstadoID(this.Estado);

        this.muniSelect = changes.domicilioInput.currentValue["municipio"];
        this.localSelect = changes.domicilioInput.currentValue["localidad"];

        this.CP = changes.domicilioInput.currentValue["cp"];
        this.Colonia = changes.domicilioInput.currentValue["colonia"];
        this.Calle = changes.domicilioInput.currentValue["calle"];
        this.NumExt = changes.domicilioInput.currentValue["numExt"];
        this.NumInt = changes.domicilioInput.currentValue["numInt"];
        this.Entre1 = changes.domicilioInput.currentValue["entre1"];
        this.Entre2 = changes.domicilioInput.currentValue["entre2"];
      }
    }
    else{      
      this.Pais = ' ';
      this.Estado = ' ';
    }
  }

  ngOnInit() {}



  getEstadoID(nombre: string): any {
    this.geograficosSvc.get('Estado').subscribe((result: any) => {
      result.forEach(element => {
        if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toString().toLowerCase().trim())){
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
          if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toString().toLowerCase().trim())){
            this.municipioSelectedId = element.id.toString();
            this.Localidad = this.localSelect;
  
            return;
          }
        });
      });

    }
  }



  getColoniaID(nombre: string){
    this.geograficosSvc.get('Colonia', this.estadoSelectedId, this.municipioSelectedId).subscribe((result: any) => {
      result.forEach(element => {
        if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toString().toLowerCase().trim())){
          this.coloniaSelectedId = element.id.toString();

          this.geograficosSvc.get('CP', this.estadoSelectedId, this.municipioSelectedId, this.coloniaSelectedId).subscribe((resultCP: any) => {
            this.CP = resultCP[0]["id"];
          
            /*
            this.obj = {
              pais: this.Pais,
              estado: this.Estado,
              municipio: this.Municipio,
              localidad: this.Localidad,
              cp: this.CP,
              colonia: this.Colonia,

              calle: this.Calle,
              numExt: this.NumExt,
              numInt: this.NumInt,
              entre1: this.Entre1,
              entre2: this.Entre2
            }
            this.dataOutput.emit(this.obj);
            */

            // if(!!result){
            //   this.CP = result["id"];
            // }
            
          })

          return element.id.toString();
        }
      });
    });
  }



  getInfoByCP(cp: string){    

    this.geograficosSvc.get('CP', null, null, null, null, cp).subscribe((result: any) => {
      var i = 0;
      result.forEach(element => {
        if(!!element){          
          this.objColonias = {};

          if(i == 0){            
            this.Municipio = element.municipio + ' ';
            this.MunicipioId = element.municipioId;            
            i++;
            //this.municipioss.push(this.Municipio)
          }

          this.objColonias = {
            nombre: element.colonia,
            id: element.coloniaId
          }
          
          this.colonias.push(this.objColonias);
        } 
      });
      //console.log(this.colonias, this.municipioss);
      this.Colonia = ' ';
      //this.Municipio = ' ';
    });
  }




  getZona(localidad: string){    
    if(!!this.estadoSelectedId){
      this.geograficosSvc.get('Zona', this.estadoSelectedId, this.municipioSelectedId, null, localidad).subscribe((result: any) => {   
        this.Zona = result[0].nombre;
        return;
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
          this.Estado = ' ';
          this.show = true;
        }
        
        this.Pais = event["nombre"];
        this.PaisId = event['id'];

        this.returnObj();
        break;

      case "Estado":
        this.Estado = event["nombre"];
        this.EstadoId = event['id'];

        if(this.Municipio == ''){ 
          this.Municipio = '';
          this.estadoSelectedId = event["id"];
        }
        else{
          this.Municipio = '';
          this.Localidad = '';
        }
        this.NumExt = '';
        this.NumInt = '';
        this.Entre1 = '';
        this.Entre2 = '';
       
        this.returnObj();
        break;

      case "Municipio":
        this.Municipio = event["nombre"];
        this.MunicipioId = event['id'];
        
        this.Localidad = ' ';
        if(this.Localidad = ' '){
          this.municipioSelectedId = event["id"];
          this.Localidad = '';
        }
        else{
          this.Localidad = ' ';
        }
        this.NumExt = '';
        this.NumInt = '';
        this.Entre1 = '';
        this.Entre2 = '';

        this.returnObj();
        break;

      case "Localidad":
        this.Localidad = event["nombre"];
        this.LocalidadId = event['id'];

        //console.log(event);
        //console.log('se seleccionó LOCALIDAD', this.Localidad, event);
        //ir por la zona:
        this.getZona(this.Localidad);        
        
        this.NumExt = '';
        this.NumInt = '';
        this.Entre1 = '';
        this.Entre2 = '';

        this.returnObj();
        break;


      case "Colonia":
        var id:any;
        var nombre: any;
        
        id = event['id'];
        nombre = event['nombre'];

        if(id == "0"){
          //otra colonia
          this.otraColonia = nombre;
        }
        else{
          this.otraColonia = '';
          if(this.Colonia == event["nombre"]){
              this.Colonia = event["nombre"];
              
          }
          else{
            //se cambió la Colonia. PLT, obtener los CP
            this.Colonia = event["nombre"];
            this.CP = ' ';
            this.getColoniaID(this.Colonia);
          }
        }

        this.ColoniaId = event['id'];
        this.returnObj();
        
        break;

        /*
      case "CP":        
        this.CP = event["nombre"];
        
        this.returnObj();
        break;
        */
        
      case "Calle":
        var id:any;
        var nombre: any;
        
        id = event['id'];
        nombre = event['nombre'];

        if(id == "0"){
          //otra calle
          this.otraCalle = nombre;
        }
        else{
          this.otraCalle = '';
          this.Calle = event["nombre"]
          //this.CalleId = event['id'];
        }

        this.returnObj();
        break;   

    }
  }



  onChange(event: any, model: string){
    var valor = event.target.value;

    switch(model){
      case "NumExt":
        this.NumExt = valor;
        break;

      case "NumInt":
        this.NumInt = valor;
        break;
        
      case "Entre1":
        this.Entre1 = valor;
        break;

      case "Entre2":
        this.Entre2 = valor;
        break;

      case "CP":
        this.CP = valor;

        this.getInfoByCP(this.CP);
        break;

      case "OtraColonia":        
        this.Colonia = valor;
        break;

      case "OtraCalle": 
        this.Calle = valor;
        break;
    }

    this.returnObj();
    
  }

  

  returnObj() {
    this.obj = {
      pais: this.Pais,
      paisId: this.PaisId,
      estado: this.Estado,
      estadoId: this.EstadoId,
      municipio: this.Municipio,
      municipioId: this.MunicipioId,
      localidad: this.Localidad,
      localidadId: this.LocalidadId,
      zona: this.Zona,
      cp: this.CP,
      colonia: this.Colonia,
      coloniaId: this.ColoniaId,
      calle: this.Calle,
      //calleId: this.CalleId,
      numExt: this.NumExt,
      numInt: this.NumInt,
      entre1: this.Entre1,
      entre2: this.Entre2
    }    

    //console.log(this.obj);
    this.dataOutput.emit(this.obj);
  }

}
