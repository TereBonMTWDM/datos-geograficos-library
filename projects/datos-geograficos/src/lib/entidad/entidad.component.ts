import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { DatosGeograficos } from '../datos-geograficos.model';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatosGeograficosService } from '../datos-geograficos.service';
import { startWith, map } from 'rxjs/operators';
import { Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'dgtit-geo-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit, OnChanges {
  @Input('entidad') entidadInput: string;
  @Input('inputdata') inputdataInput: string;
  @Input('require') requireInput: boolean;
  @Input('min') minInput: number;
  @Input('max') maxInput: number;
  @Input('textoValido') textoValidoInput: boolean;
  @Input('idEstado') idEstadoInput: string;
  @Input('idMunicipio') idMunicipioInput: string;
  @Input('localidad') localidadInput: string;
  @Input('habilitado') habilitadoInput: Boolean;
  @Input('colonias') coloniasInput: any;
  //@Input('municipios') municipiosInput: any;
  
  @Output() onSelectCombo = new EventEmitter<string>();

  @ViewChild('autocomplete', { static: false }) autocomplete: MatAutocomplete;
  private textoValido = /^\S((?!.*  ).*\S)?$/
  placeholder: string;
  validadores:any = [];
  Model: DatosGeograficos[];
  Control = new FormControl();
  Selected: string = '';
  SelectedId: string;
  entidad = '';
  entidadAbrev = '';
  inputdata = '';
  
  outputData: any;
  
  idEstado: string = '';
  idMunicipio: string = '';
  
  changeEdo: boolean;
  changeMpio: boolean;
  
  
  RegistroUsuario;
  
  Filtred: Observable<DatosGeograficos[]>
  objColonias:any;
  objMunicipio:any;
  
  constructor(
    private geograficosSvc: DatosGeograficosService
  ) { 
    //this.Control.setValidators(forbiddenNamesValidator(this.Model));
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.coloniasInput) {       
      this.objColonias = changes.coloniasInput.currentValue      
    }
    // if(changes.municipiosInput) {       
    //   this.objMunicipio = changes.municipiosInput.currentValue      
    // }

    if(!!changes.inputdataInput){
      if(!!changes.inputdataInput.currentValue){
        
        this.getData();
        
        //Setea el valor del combo
        this.inputdata = changes.inputdataInput.currentValue.toString().trim();        
        this.Selected = this.inputdata;
      }
    }

    if(!!changes.idEstadoInput){
      if(!!changes.idEstadoInput.currentValue){
        this.idEstado = changes.idEstadoInput.currentValue; // !important
        
        if(!!changes.idEstadoInput.previousValue){
          this.changeEdo = true;
          this.inputdata = '';
        }
        this.getData();
      }
    }

    if(!!changes.idMunicipioInput){
      if(!!changes.idMunicipioInput.currentValue){
        
        this.idMunicipio = changes.idMunicipioInput.currentValue; // !important
        
        if(!!changes.idMunicipioInput.previousValue){
          this.changeMpio = true;
          this.inputdata = '';
        }
        
        this.getData();
      }
    }

    
    
    //Validadores del control
    if(changes.minInput != null && changes.maxInput != null && changes.requireInput != null && changes.textoValidoInput != null){
      if(changes.requireInput.currentValue === "true"){ this.validadores.push(Validators.required)}
        this.validadores.push(Validators.minLength(changes.minInput.currentValue), Validators.maxLength(changes.maxInput.currentValue)
        //, forbiddenNamesValidator(this.Model)
        );
      if(changes.textoValidoInput.currentValue === "true") { Validators.pattern(this.textoValido)}

      //this.Control = new FormControl(null, [this.validadores, forbiddenNamesValidator([])]);
      //this.Control = new FormControl(null, [this.validadores, forbiddenNamesValidator(this.Model)]);
      this.Control = new FormControl('', this.validadores);
    }
    
  }

  

  ngOnInit() {
    this.placeholder = this.entidadInput;
    
  }
  
  async irServicio(){
    var servicio: boolean = false;
    
    switch(this.entidadInput){
      
      case "Pais":        
        servicio = true;
        break;

      case "Estado":
        servicio = true;
        break;

      case "Municipio":
        if(!!this.idEstado){
          servicio = true;
        }else{
          servicio = false;
        }
        break;

      case "Localidad":
        if(!!this.idEstado && !!this.idMunicipio){
          servicio = true;
        }else{
          servicio = false;
        }
        break;


      case "Zona":
        if(!!this.idEstado && !!this.idMunicipio){
          servicio = true;
        }
        else{
          servicio = false;
        }
        break;

      case "CP":        
        if(!!this.idEstado && !!this.idMunicipio){
          servicio = true;
        }else{
          servicio = false;
        }        
        break;

      case "Colonia":
        if(!!this.idEstado && !!this.idMunicipio){
          servicio = true;
        }else{
          servicio = false;
        }
        break;

      case "Calle":
        if(!!this.idEstado && !!this.idMunicipio){
          servicio = true;
        }else{
          servicio = false;
        }
        break;


    }

    if(servicio){this.getData();}


  }


  async getData(){
    //console.log(this.entidadInput, this.habilitadoInput);

    if(this.habilitadoInput == false) { this.Control.disable();}


      await this.geograficosSvc.get(this.entidadInput, this.idEstado, this.idMunicipio).subscribe((result: any) => {        
        this.Model = result;
        
        if(this.Model.length > 0){
          
          if(this.changeEdo){ this.Selected = '' }
          if(this.changeMpio){ this.Selected = '' }
          
          if(this.entidadInput == 'Pais' && this.Selected == ''){ this.Selected = 'MÉXICO';}
          if(this.entidadInput == 'Estado'){ 
            this.Selected = 'GUANAJUATO';
            this.outputData = {
              id: "11",
              nombre: this.Selected
            }            
          this.onSelectCombo.emit(this.outputData);
          }

          if(this.entidadInput == 'Colonia' && this.objColonias.length > 0){
            //console.log('trae colonia', this.objColonias);
            this.Model = this.objColonias;
          }
          /*
          if(this.entidadInput == 'Municipio' && this.objMunicipio.length > 0){
            console.log('trae array municipio', this.objMunicipio);
            //this.Model = this.objMunicipio;
          }
          */
         
          
          
          
          
         /*
         if(this.entidadInput = 'CP'){
           console.log('Se eligió CP');
         }
         */
         
          
          if(this.entidadInput == 'Localidad'){          
            if(this.Model.length > 600){ 
              this.Model.splice(490) // mat autocomplete no permite cargar más registros, en caso de Localidad
            }          
          }

          if(this.entidadInput == 'Colonia'){
            this.Model.push({id: '0', nombre: '--- otra colonia ---'});
          }

          if(this.entidadInput == 'Calle'){
            this.Model.push({id: '0', nombre: '--- otra calle ---'});
          }

          if(this.Selected == ''){
            
            this.Control = new FormControl(null, [
              forbiddenNamesValidator(this.Model)
            ]);
            
            this.Filtred = this.Control.valueChanges.pipe(
              startWith<string | any>(),
              map(value => typeof value === 'string' ? value : value.nombre),
              map(name => name ? this._filter(name) : this.Model ? this.Model.slice(): [])
            );
          }
          else{                
                if(this.entidadInput == 'Municipio'){
                  this.Selected = this.Selected + ' ';
                }
                
            this.Filtred = this.Control.valueChanges.pipe(
              startWith<string | any>(this.Selected),
              map(value => typeof value === 'string' ? value : value),
              map(name => name ? this._filter(name) : this.Model ? this.Model.slice(): [])
            );
            this.Model.forEach(element => {
              if (this.filtrar_acentos(this.Selected.toString().toLowerCase().trim()) == this.filtrar_acentos(element.nombre.toString().toLowerCase().trim())) {


                this.SelectedId = element.id.toString();
                this.entidad = element.nombre;

    
                this.outputData = {
                  id: this.SelectedId,
                  nombre: this.entidad
                }
                this.onSelectCombo.emit(this.outputData);
              }
            });
          }
        }
      });
  }

  


  focusOutFunction(event: any) {
    let model = event.target['id'];
  }



  chooseFirstOption(): void {  
    
    if (this.Selected != '') {
      if (!!this.autocomplete && !!this.autocomplete.options && !!this.autocomplete.options.first) { 
        if (this.autocomplete.options.first.select() != undefined) { 
          this.autocomplete.options.first.select();
      } } }          
    // if (this.Selected != '') {
    //   if (this.autocomplete != undefined) { if (this.autocomplete.options.first.select() != undefined) { this.autocomplete.options.first.select();
    //   } } }          
  }



  private _filter(value: string): any[] {
    var word = this.filtrar_acentos(value);
    this.Selected = word;    
    return this.Model.filter(option => this.filtrar_acentos(option.nombre.toString().toLowerCase()).includes(word));
  }



  filtrar_acentos(input) {
    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";

    for (var i = 0; i < acentos.length; i++) {
      input = input.replace(acentos.charAt(i), original.charAt(i)).toLowerCase();
    };

    return input;
  }



  Display(value?: DatosGeograficos): string | undefined {    
    //return value ? value.nombre : undefined;    
    return value ? value.toString() : undefined;
  }



  onSelectionChanged(event: MatAutocompleteSelectedEvent) {       
    if (this.filtrar_acentos(event.option.value.toString().toLowerCase().trim()) != this.filtrar_acentos(this.Control.value.toString().toLowerCase().trim())
    || this.filtrar_acentos(event.option.value.toString().toLowerCase().trim()) != this.filtrar_acentos(this.entidad.toString().toLowerCase().trim())) {
            
      this.Model.findIndex(data => {      
        var esIgual = new RegExp("^" + data.nombre + "$").test(event.option.value)

        if(esIgual){          
          this.SelectedId = data.id;
          this.entidad = data.nombre;

          this.outputData = {
              id: this.SelectedId,
              nombre: this.entidad
            }
            
          this.onSelectCombo.emit(this.outputData);

          throw Breakpoints;
        }
      });
    }   
  }


  trackById(index: number, model: DatosGeograficos) {
    //console.log(model, index);imprime todos
    return model.id;
  }




}

export function forbiddenNamesValidator(Services: DatosGeograficos[]): ValidatorFn | null {    
  return (control: AbstractControl): { [key: string]: any } | null => {
    const index = Services.findIndex(Service => {
      return new RegExp("^" + Service.nombre + "$").test(control.value);
    });    
    return index < 0 ? { forbiddenNames: { value: control.value } } : null;
  };  
}

