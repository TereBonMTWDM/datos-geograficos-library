import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable, of } from 'rxjs';
import { take, startWith, map, catchError } from 'rxjs/operators';
import { DatosGeograficosService } from '../datos-geograficos.service';

@Component({
  selector: 'dgtit-geo-domicilio-multi',
  templateUrl: './domicilio-multi.component.html',
  styleUrls: ['./domicilio-multi.component.scss']
})
export class DomicilioMultiComponent implements OnInit {
  @Input('domicilio') domicilioInput: any;
  @Output('onSelect') dataOutput = new EventEmitter<any>();

  
  /* #region  Properties */
  public _noExisteCP: boolean = false;
  public Domicilio: any;
  public isLoading:boolean = false;
  private textoValido = /^\S((?!.*  ).*\S)?$/;
  //public isLoading: boolean = true;
  public objOutput = {};

  public CP = '';
  public zona = '';
  Municipio = '';
  MunicipioId = '';
  Localidad = '';
  Colonia = '';
  ColoniaId = '';
  Calle = '';
  NumExt: string = '';
  NumInt: string = '';
  EntreCalle1: string = '';
  EntreCalle2: string = '';

  municipios: any[];
  localidades: any[];
  colonias: any[] = [];
  calles: any[] = [];
  entreCalles1: any[] = [];
  entreCalles2: any[] = [];

  //cpControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.min(36000), Validators.max(38999), this.ExisteCPValidator]);
  cpControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.min(36000), Validators.max(38999)],[ValidaCPAsync.createValidator(this.geograficosSvc)]);
  municipioControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required]);
  localidadControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required]);
  coloniaControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required]);
  calleControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required]);
  EntreCalle1Control = new FormControl('', [Validators.pattern(this.textoValido)]);
  EntreCalle2Control = new FormControl('', [Validators.pattern(this.textoValido)]);
  numExtControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.minLength(1), Validators.maxLength(10)]);
  numIntControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.minLength(1), Validators.maxLength(10)]);

  otraColoniaControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required]);
  otraCalleControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  EntreOtraCalle1Control = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  EntreOtraCalle2Control = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.minLength(3), Validators.maxLength(100)]);

  @ViewChild('autocompleteMunicipio', { static: false }) autocompleteMunicipio: MatAutocomplete;
  @ViewChild('autocompleteLocalidad', { static: false }) autocompleteLocalidad: MatAutocomplete;
  @ViewChild('autocompleteColonia', { static: false }) autocompleteColonia: MatAutocomplete;
  @ViewChild('autocompleteCalle', { static: false }) autocompleteCalle: MatAutocomplete;
  @ViewChild('autocompleteEntreCalle1', { static: false }) autocompleteEntreCalle1: MatAutocomplete;
  @ViewChild('autocompleteEntreCalle2', { static: false }) autocompleteEntreCalle2: MatAutocomplete;

  @ViewChild('cpfield', { static: true }) cpfield: ElementRef;
  @ViewChild('municipiofield', { static: true }) municipiofield: ElementRef;
  @ViewChild('localidadfield', { static: true }) localidadfield: ElementRef;
  @ViewChild('coloniafield', { static: true }) coloniafield: ElementRef;
  @ViewChild('callefield', { static: true }) callefield: ElementRef;
  @ViewChild('entrecalle1field', { static: true }) entrecalle1field: ElementRef;
  @ViewChild('entrecalle2field', { static: true }) entrecalle2field: ElementRef;

  municipioFiltred: Observable<any[]>
  localidadFiltred: Observable<any[]>
  coloniaFiltred: Observable<any[]>
  calleFiltred: Observable<any[]>
  entreCalle1Filtred: Observable<any[]>
  entreCalle2Filtred: Observable<any[]>

  municipioSelected: string = '';
  localidadSelected: string = '';
  coloniaSelected: string = '';
  calleSelected: string = '';
  entreCalle1Selected: string = ''
  entreCalle2Selected: string = ''

  municipioSelectedId: string;
  localidadSelectedId: string = '';
  coloniaSelectedId: string = '';
  calleSelectedId: string = '';
  entreCalle1SelectedId: string = ''
  entreCalle2SelectedId: string = ''

  public objColonias: any;
  public otraColonia: boolean = false;
  public otraCalle: boolean = false;
  public entreOtraCalle: boolean = false;
  public entreOtraCalle2: boolean = false;
  /* #endregion */
  breakpointA: any;
  breakpointB: any; 
  breakpointC: any; 
  breakpointD: any; 
  breakpointE: any; 
  constructor(
    private geograficosSvc: DatosGeograficosService
  ) { }

  ngOnChanges(changes: SimpleChanges){
    if(!!changes.domicilioInput && !!changes.domicilioInput.currentValue){
      
      var domicilio = changes.domicilioInput.currentValue;
      
      if(Object.keys(domicilio).length !== 0){ 
        this.Domicilio = true;

        this.Municipio = domicilio['municipio'];
        this.MunicipioId = domicilio['municipioId'];
        this.Localidad = domicilio['localidad'];
        this.zona = domicilio['zona'];
        this.CP = domicilio['cp'];
        this.Colonia = domicilio['colonia'];
        this.ColoniaId = domicilio['coloniaId'];
        this.Calle = domicilio['calle'];
        this.NumExt = domicilio['numExt'];
        this.NumInt = domicilio['numInt'];
        this.EntreCalle1 = domicilio['entre1'];
        this.EntreCalle2 = domicilio['entre2'];
      }
      else{
        this.Domicilio = false;
      }

    }
    else{
      this.Municipio = '';
      this.CP = '';
    }
  }

  ngOnInit() {
    this.breakpointA = (window.innerWidth <= 610) ? 1 : 3;
    this.breakpointB = (window.innerWidth <= 890) ? 1 : 2;
    this.breakpointC = (window.innerWidth <= 850) ? 1 : 3;
    this.breakpointD = (window.innerWidth <= 850) ? 1 : 4;
    this.breakpointE = (window.innerWidth <= 850) ? 1 : 4;
    
    
    this.LoadMunicipios();

    if(this.Domicilio){ 
      
    } else {
      this.cpfield.nativeElement.focus();
      
    }
   
  }

  onResize(event) {
    this.breakpointA = (event.target.innerWidth <= 610) ? 1 : 3;
    this.breakpointB = (event.target.innerWidth <= 890) ? 1 : 2;
    this.breakpointC = (event.target.innerWidth <= 850) ? 1 : 3;
    this.breakpointD = (event.target.innerWidth <= 850) ? 1 : 4;
    this.breakpointE = (event.target.innerWidth <= 850) ? 1 : 4;
  }

  /* #region  On() */

  onSelectionChanged(event: MatAutocompleteSelectedEvent, model: string) {
    var valor = event.option.value;
    this.SelectData(model, valor);
  }


  onChange(event: any, model: string) {
    var value = event.target.value.toString().toUpperCase();

    switch (model) {
      case 'CP':
        this.CP = value;

        let cp = parseInt(this.CP);
       
        if (this.CP == '') {
          //console.log('cp vacio');
          //this.LoadColonias();
          this.colonias = [];
          this.coloniaControl = new FormControl(null, [forbiddenNamesValidator(this.colonias), Validators.pattern(this.textoValido), Validators.required]);
          //console.log(this.colonias);
          this.coloniaFiltred = this.coloniaControl.valueChanges.pipe(
            startWith<string | any>(),
            map(value => typeof value === 'string' ? value : value.nombre),
            map(name => name ? this._filter('coloniaId', name) : this.colonias ? this.colonias.slice() : [])
          );
          
          console.log(this.coloniaControl);
          this.municipiofield.nativeElement.focus();
          this.municipioControl.enable();

          



        }
        
        else {
          
          if(cp >= 36000 && cp <= 38999){
            this.municipioControl.disable();
            this.LoadMuninicipiosColoniasByCp(this.CP);
            this.localidadfield.nativeElement.focus();
          }
        }

        this.calleControl = new FormControl(null, [forbiddenNamesValidator(this.calles), Validators.pattern(this.textoValido), Validators.required]);
        this.EntreCalle1Control = new FormControl('', [Validators.pattern(this.textoValido)]);
        this.EntreCalle2Control = new FormControl('', [Validators.pattern(this.textoValido)]);
        
        this.otraCalleControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
        this.EntreOtraCalle1Control = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
        this.EntreOtraCalle2Control = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.minLength(3), Validators.maxLength(100)]);

        this.otraCalle = false;
        this.entreOtraCalle = false;
        this.entreOtraCalle2 = false;

        break;

      case "OtraColonia":
        this.coloniaSelected = value;
        this.EmitObj();
        break;

      case 'OtraCalle':
        this.calleSelected = value;
        this.EmitObj();

        break;

      case 'EntreOtraCalle':
        this.entreCalle1Selected = value;
        this.EmitObj();
        break;


      case 'EntreOtraCalle2':
        this.entreCalle2Selected = value;
        this.EmitObj();
        break;

      case 'NumExt':
        this.NumExt = value;
        this.EmitObj();

        break;

      case 'NumInt':
        this.NumInt = value;
        this.EmitObj();
        break;
    }

  }


  onCheck(event: any){
    //console.log(event);

    switch(event.source.id){
      case "noColonia":
        if(event.checked){
          this.otraColonia = true;
          this.coloniafield.nativeElement.focus();
        }
        else{
          this.otraColonia = false;
        }
        break;
      case "noCalle":
        if(event.checked){
          this.otraCalle = true;
          this.callefield.nativeElement.focus();
        }
        else{
          this.otraCalle = false;
        }
        break;

      case "noEntreCalle":
        if(event.checked){
          this.entreOtraCalle = true;
          this.entrecalle1field.nativeElement.focus();
        }
        else{
          this.entreOtraCalle = false;
        }
      break;

      case "noEntreOtraCalle":
        if(event.checked){
          this.entreOtraCalle2 = true;
          this.entrecalle2field.nativeElement.focus();
        }
        else{
          this.entreOtraCalle2 = false;
        }
      break;

    }
  }



  onKey(event: any) {
    if (event.target.value == '') {
      this.municipioSelected = ''; this.municipioSelectedId = '';
      this.municipioControl.enable();
    }
  }
  /* #endregion */


  SelectData(model:string, nombre:string){
    switch(model){
      case 'municipioId':
        //Obtener id:
        this.municipios.findIndex(data => {
          if(data.nombre.includes(nombre)) {
            this.municipioSelectedId = data.id;
            this.municipioSelected = this.municipioControl.value;

            this.localidadSelected = ''; this.zona = ''; this.coloniaSelected = ''; this.calleSelected = ''; this.NumExt = ''; this.NumInt = ''; this.entreCalle1Selected = ''; this.entreCalle2Selected = '';
            this.LoadLocalidades();
            this.LoadColonias();
            this.LoadCalles();
          }
        });

        break;

      case 'localidadId':
        if((this.filtrar_acentos(nombre.toLowerCase().trim()) === (this.filtrar_acentos(this.localidadControl.value.toString().toLowerCase().trim())))){
          
          this.localidadSelected = nombre;

          //Obtener Zona:
          this.geograficosSvc.getTipoZona(this.municipioSelectedId, this.localidadSelected).subscribe((result: any) => {
            if (!!result.data) {
              this.zona = result.data[0].nombre;
            }
          })
        }
        break;

      case 'coloniaId':
          if((this.filtrar_acentos(nombre.toLowerCase().trim()) === (this.filtrar_acentos(this.coloniaControl.value.toString().toLowerCase().trim())))){
            
            //Obtiene id:
            this.colonias.findIndex(data => {
              if(data.nombre.includes(nombre)){
                this.coloniaSelectedId = data.id;
                this.coloniaSelected = this.coloniaControl.value;

                if(this.coloniaSelectedId == '0'){
                  this.coloniaControl.disable();
                  this.otraColonia = true;
                }

                this.LoadCodigosPostales();
                this.EmitObj();
              }
            });
          }
          break;


    case 'calleId':
          if((this.filtrar_acentos(nombre.toLowerCase().trim()) === (this.filtrar_acentos(this.calleControl.value.toString().toLowerCase().trim())))){
            //Obtiene id:
            this.calles.findIndex(data => {
              if(data.nombre.includes(nombre)){
                this.calleSelectedId = data.id;
                this.calleSelected = this.calleControl.value;
                //this.calleSelected = data.nombre;

                if(this.calleSelectedId == '0'){
                  this.calleControl.disable();
                  this.otraCalle = true;
                }

                this.EmitObj();
              }
            });
          }
          break;

      case 'entreCalle1Id':
        if((this.filtrar_acentos(nombre.toLowerCase().trim()) === (this.filtrar_acentos(this.EntreCalle1Control.value.toString().toLowerCase().trim())))){
          
          //Obtiene id:
          this.entreCalles1.findIndex(data => {
            if(data.nombre.includes(nombre)){
              this.entreCalle1SelectedId = data.id;
              this.entreCalle1Selected = this.EntreCalle1Control.value;

              if(this.entreCalle1SelectedId == '0'){
                this.EntreCalle1Control.disable();
                this.entreOtraCalle = true;

                //this.entrecalle1field.nativeElement.focus();
              }

              this.EmitObj();
            }
          });
        }
        break;   
        
        
        case 'entreCalle2Id':
          if((this.filtrar_acentos(nombre.toLowerCase().trim()) === (this.filtrar_acentos(this.EntreCalle2Control.value.toString().toLowerCase().trim())))){
            
            //Obtiene id:
            this.entreCalles2.findIndex(data => {
              if(data.nombre.includes(nombre)){
                this.entreCalle2SelectedId = data.id;
                this.entreCalle2Selected = this.EntreCalle2Control.value
  
                if(this.entreCalle2SelectedId == '0'){
                  this.EntreCalle2Control.disable();
                  this.entreOtraCalle2 = true;
  
                  //this.entrecalle2field.nativeElement.focus();
                }
  
                this.EmitObj();
              }
            });
          }
          break;   
    }

  }

  private _filter(model: string, value: any): any[] {
    const filterValue = value;
    var word = this.filtrar_acentos(filterValue);
    
    switch (model) {

      case 'municipioId':
        return this.municipios.filter(option => this.filtrar_acentos(option.nombre.toString().toLowerCase()).includes(word));

      case 'localidadId':
        return this.localidades.filter(option => this.filtrar_acentos(option.nombre.toString().toLowerCase()).includes(word));

      case 'coloniaId':
        return this.colonias.filter(option => this.filtrar_acentos(option.nombre.toString().toLowerCase()).includes(word));

      case 'calleId':
        return this.calles.filter(option => this.filtrar_acentos(option.nombre.toString().toLowerCase()).includes(word));

      case 'entreCalle1Id':
        return this.entreCalles1.filter(option => this.filtrar_acentos(option.nombre.toString().toLowerCase()).includes(word));

      case 'entreCalle2Id':
        return this.entreCalles2.filter(option => this.filtrar_acentos(option.nombre.toString().toLowerCase()).includes(word));
    }
  }



  /* #region  #GET DATOS GEOGRAFICOS */
  LoadMunicipios() {
    this.geograficosSvc.getMunicipiosByEdo().pipe(take(1)).subscribe((result: any) => {
      if(result.statusCode == '200'){
        this.municipios = result.data;
  
        if (this.municipios.length > 0){
          if (!!this.Municipio) {
            this.municipioSelected = this.Municipio;
            this.municipioSelectedId = this.MunicipioId;
            this.LoadLocalidades();
            this.LoadColonias();
            this.LoadCalles();
          }
          this.municipioControl = new FormControl(null, [forbiddenNamesValidator(this.municipios), Validators.pattern(this.textoValido), Validators.required]);
  
          this.municipioFiltred = this.municipioControl.valueChanges.pipe(
            startWith<string | any>(),
            map(value => typeof value === 'string' ? value : value),
            map(name => name ? this._filter('municipioId', name) : this.municipios ? this.municipios.slice() : [])
          );
  
          this.municipios.forEach((element: any) => {
  
            if (this.filtrar_acentos(this.municipioSelected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.nombre.toString().trim().toLowerCase())) {
              this.municipioSelectedId = element.id;
              this.municipioSelected = element.nombre;
              this.municipioControl.setValue(this.municipioSelected);
            }
          });
        }
        else{
          //no hay data
          this.dataOutput.emit(result);
        }

      }
      else{
        this.dataOutput.emit(result);
      }
    });
  }

  LoadMuninicipiosColoniasByCp(cp: string = null) {
    var i = 0;

    console.log(cp);
    this.geograficosSvc.getByCp(cp).pipe(take(1)).subscribe((result: any) => {
      console.log(result);
      if(result.statusCode == '200'){
        if (!!result.data) {
          
          this.colonias = [];
          result.data.forEach((element: any) => {
            this.objColonias = {}
  
            if (i == 0) {
              this.municipioSelected = element.municipio.toString().toUpperCase();
              this.municipioSelectedId = element.municipioID;
              this.EmitObj()
  
              //OBtener las localidades dado el municipio:
              this.LoadLocalidades();
  
              //this.getColonias();
              this.LoadCalles();
  
              i++;
            }
  
            this.objColonias = {
              nombre: element.asentamiento,
              id: element.asentamientoID
            }
            this.colonias.push(this.objColonias);
            
          });
        }
        else {
          this.dataOutput.emit(result);
        }
        //console.log(this.colonias);
        this.LoadColonias(this.colonias);

      }
      else{
        this._noExisteCP = true;
        console.log(this._noExisteCP);
        //this.localidadControl = new FormControl(null, [forbiddenNamesValidator(this.localidades)]);
        //this.cpControl = new FormControl(null, [this.ExisteCPValidator(this.cpControl.value)])
        //console.log(this.cpControl.value);
        //this.cpControl = new FormControl('', [Validators.pattern(this.textoValido), Validators.required, Validators.min(36000), Validators.max(38999), this.ExisteCPValidator]);
        //this.cpControl.setValue(10000);
        

        this.dataOutput.emit(result);
      }
    });
  }

  LoadLocalidades() {
    var localArray = [];
    var obj: any = {};

    this.geograficosSvc.getLocalidades(this.municipioSelectedId).subscribe((result: any) => {
      if(result.statusCode == '200'){
        if (!!result.data) {
          this.localidades = result.data;
  
          if (this.localidades.length > 0) {
            if(!!this.Localidad){
              this.localidadSelected = this.Localidad;
            }
            this.localidades.forEach((element: any) => {
              if (element.nombre.includes('-')) {
              }
              else {
                obj = {};
                obj = {
                  id: element.id,
                  nombre: element.nombre
                };
                localArray.push(obj);
              }
            });
  
            this.localidades = localArray;
  
            this.localidadControl = new FormControl(null, [forbiddenNamesValidator(this.localidades)]);
  
  
            //this.localidadSelected
            this.localidadFiltred = this.localidadControl.valueChanges.pipe(
              startWith<string | any>(),
              map(value => typeof value === 'string' ? value : value.nombre),
              map(name => name ? this._filter('localidadId', name) : this.localidades ? this.localidades.slice() : [])
            );
  
            this.localidades.forEach((element: any) => {
              if (this.filtrar_acentos(this.localidadSelected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.nombre.toString().trim().toLowerCase())) {
                this.localidadSelectedId = element.id;
                this.localidadSelected = element.nombre;
                this.localidadControl.setValue(this.localidadSelected);
              }
            });
          }
        }
        else{
          this.dataOutput.emit(result);
        }
      }
      else{
        this.dataOutput.emit(result);
      }
    
    });
  }

  LoadColonias(objCol?: any) {
    //this.colonias.splice(0,0, { id:'0', nombre: '--- Otra colonia, especifique ---'});
    if (!!objCol) {
      //ya trajo colonias en OBJ, si se consultó por CP
      this.colonias = objCol;
      //this.colonias.splice(0,0, { id:'0', nombre: '--- Otra colonia, especifique ---'});

      if (this.colonias.length > 0) {
        if (!!this.Colonia) {
          this.coloniaSelected = this.Colonia;
          this.coloniaSelectedId = this.ColoniaId;
          
        }
        else {
          //this.colonias.push({ id: '0', nombre: '--- Otra colonia, especifique ---' });

          //this.coloniaSelected
          this.coloniaControl = new FormControl(null, [forbiddenNamesValidator(this.colonias), Validators.pattern(this.textoValido), Validators.required]);
          this.coloniaFiltred = this.coloniaControl.valueChanges.pipe(
            startWith<string | any>(),
            map(value => typeof value === 'string' ? value : value.nombre),
            map(name => name ? this._filter('coloniaId', name) : this.colonias ? this.colonias.slice() : [])
          );

          this.colonias.forEach((element: any) => {
            if (this.filtrar_acentos(this.coloniaSelected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.nombre.toString().trim().toLowerCase())) {

              this.coloniaSelectedId = element.id;
              this.coloniaSelected = element.nombre;
              this.coloniaControl.setValue(this.coloniaSelected);
            }
          });

        }

      }
    }
    else {
      this.geograficosSvc.getColonias(this.municipioSelectedId).subscribe((result: any) => {
        if(result.statusCode){
          if (!!result.data) {
            this.colonias = result.data;
  
            if (this.colonias.length > 0) {
  
              if (!!this.Colonia) {
                this.coloniaSelected = this.Colonia;
                this.coloniaSelectedId = this.ColoniaId;
              }
              
              //this.colonias.push({ id: '0', nombre: '--- Otra Colonia, especifique ---' });
  
              //this.coloniaSelected
              this.coloniaControl = new FormControl(null, [forbiddenNamesValidator(this.colonias), Validators.pattern(this.textoValido), Validators.required]);
              this.coloniaFiltred = this.coloniaControl.valueChanges.pipe(
                startWith<string | any>(),
                map(value => typeof value === 'string' ? value : value.nombre),
                map(name => name ? this._filter('coloniaId', name) : this.colonias ? this.colonias.slice() : [])
              );
  
              this.colonias.forEach((element: any) => {
                if (this.filtrar_acentos(this.coloniaSelected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.nombre.toString().trim().toLowerCase())) {
  
                  this.coloniaSelectedId = element.id;
                  this.coloniaSelected = element.nombre;
                  this.coloniaControl.setValue(this.coloniaSelected);
                }
              });
            }
          }
          else{
            this.dataOutput.emit(result);
          }

        }
        else{
          this.dataOutput.emit(result);
        }
      })
    }
  }

  LoadCalles() {
    this.isLoading = true;
    this.geograficosSvc.getCalles(this.municipioSelectedId).subscribe((result: any) => {
      this.isLoading = false;
      if(result.statusCode == '200'){
        if (!!result.data) {
          this.calles = result.data;
          this.calles.splice(0,0, { id:'0', nombre: '--- Otra calle, especifique ---'});
          // this.entreCalles1 = result.data;
          // this.entreCalles2 = result.data;
          this.entreCalles1 = this.calles;
          this.entreCalles2 = this.calles;
  
          if (this.calles.length > 0) {
            if (!!this.Calle) {
             this.calleSelected = this.Calle;           
            }
            //this.calleSelected
            //this.calles.push({ id: '0', nombre: '--- Otra Calle, especifique ---' });
            this.calleControl = new FormControl(null, [forbiddenNamesValidator(this.calles), Validators.pattern(this.textoValido), Validators.required]);
            this.calleFiltred = this.calleControl.valueChanges.pipe(
              startWith<string | any>(),
              map(value => typeof value === 'string' ? value : value.nombre),
              map(name => name ? this._filter('calleId', name) : this.calles ? this.calles.slice() : [])
            );
  
            this.calles.forEach((element: any) => {
              if (this.filtrar_acentos(this.calleSelected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.nombre.toString().trim().toLowerCase())) {
  
                this.calleSelectedId = element.id;
                this.calleSelected = element.nombre;
                console.log('this.calleSelected', this.calleSelected);
                this.calleControl.setValue(this.calleSelected);
              }
            });
          }
  
          if (this.entreCalles1.length > 0) {
            if (!!this.EntreCalle1) {
              this.entreCalle1Selected = this.EntreCalle1;
            }
            
            this.EntreCalle1Control = new FormControl(null, [forbiddenNamesValidator(this.entreCalles1), Validators.pattern(this.textoValido)]);
  
            //this.entreCalle1Selected
            this.entreCalle1Filtred = this.EntreCalle1Control.valueChanges.pipe(
              startWith<string | any>(),
              map(value => typeof value === 'string' ? value : value.nombre),
              map(name => name ? this._filter('entreCalle1Id', name) : this.entreCalles1 ? this.entreCalles1.slice() : [])
            );
  
            this.entreCalles1.forEach((element: any) => {
              if (this.filtrar_acentos(this.entreCalle1Selected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.nombre.toString().trim().toLowerCase())) {
  
                this.entreCalle1SelectedId = element.id;
                this.entreCalle1Selected = element.nombre;
                this.EntreCalle1Control.setValue(this.entreCalle1Selected);
              }
            });
          }
  
  
  
          //Entre Calle 2
          if (this.entreCalles2.length > 0) {
            if (!!this.EntreCalle2) {
              this.entreCalle2Selected = this.EntreCalle2;
            }
            
            this.EntreCalle2Control = new FormControl(null, [forbiddenNamesValidator(this.entreCalles2), Validators.pattern(this.textoValido)]);
  
            //this.entreCalle2Selected
            this.entreCalle2Filtred = this.EntreCalle2Control.valueChanges.pipe(
              startWith<string | any>(),
              map(value => typeof value === 'string' ? value : value.nombre),
              map(name => name ? this._filter('entreCalle2Id', name) : this.entreCalles2 ? this.entreCalles2.slice() : [])
            );
  
            this.entreCalles2.forEach((element: any) => {
              if (this.filtrar_acentos(this.entreCalle2Selected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.nombre.toString().trim().toLowerCase())) {
  
                this.entreCalle2SelectedId = element.id;
                this.entreCalle2Selected = element.nombre;
                this.EntreCalle2Control.setValue(this.entreCalle2Selected);
              }
            });
          }
        }
        else{
          this.dataOutput.emit(result);
        }
      }
      else{
        this.dataOutput.emit(result);
      }
    })
  }

  LoadCodigosPostales() {
    this.geograficosSvc.getCodigosPostalesByEdoMuniCol(this.municipioSelectedId, this.coloniaSelectedId).pipe(take(1)).subscribe((result: any) => {
      if(result.statusCode == '200'){
        if (!!result.data) {
          this.CP = result.data[0].nombre;
        }
        else{
          this.dataOutput.emit(result);
        }

      }
      else{
        this.dataOutput.emit(result);
      }
    });
  }


  ///get IDs //revisar this
  async getMunicipioID(nombre: string) {
    await this.geograficosSvc.getMunicipiosByEdo().subscribe((result: any) => {
      if (!!result.data) {
        result.data.forEach((element: any) => {
          if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toString().toLocaleLowerCase().trim())) {
            this.municipioSelectedId = element.id;
            this.LoadLocalidades();
            this.LoadColonias();
            this.LoadCalles();
          }
        });
      }
    })
  }

  async getLocalidadID(nombre: string) {
    await this.geograficosSvc.getLocalidades(this.municipioSelectedId).subscribe((result: any) => {
      
      if (!!result.data) {
        result.data.forEach((element: any) => {
      
          if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toString().toLocaleLowerCase().trim())) {

            this.localidadSelected = element.nombre;      

            this.geograficosSvc.getTipoZona(this.municipioSelectedId, this.localidadSelected).subscribe((result: any) => {
      
              if (!!result.data) {
                this.zona = result.data[0].nombre;

                this.EmitObj();
              }
            })
          }
        });
      }
    })
  }

  async getColoniaID(nombre: string) {
    await this.geograficosSvc.getColonias(this.municipioSelectedId).subscribe((result: any) => {
      if (!!result.data) {
        result.data.forEach((element: any) => {
          if (this.filtrar_acentos(element.nombre.toString().toLowerCase().trim()) == this.filtrar_acentos(nombre.toString().toLocaleLowerCase().trim())) {
            this.coloniaSelectedId = element.id;
          }
        });
      }
    })
  }

  /* #endregion */


  chooseFirstOption(event: any): void { //sòlo funcionará la 1ra vez
    let model = event.target['id'];
    
    switch (model) {
      case 'municipioId':
        if (this.municipioSelected == '') {
          if (!!this.autocompleteMunicipio && !!this.autocompleteMunicipio.options && !!this.autocompleteMunicipio.options.first) {
            if (this.autocompleteMunicipio.options.first.select() != undefined) {
              this.autocompleteMunicipio.options.first.select();
            }
          }
        }
        break;

      case 'localidadId':
        // console.log(this.localidadSelected, this.localidadSelectedId);
        // console.log(this.autocompleteLocalidad);
        // console.log('select', this.autocompleteLocalidad.options.first.select());
        // console.log('selected', this.autocompleteLocalidad.optionSelected);

        if (this.localidadSelected == '') {
          if (!!this.autocompleteLocalidad && !!this.autocompleteLocalidad.options && !!this.autocompleteLocalidad.options.first) {
            if (this.autocompleteLocalidad.options.first.select() != undefined) {
              this.autocompleteLocalidad.options.first.select();
            }
          }
        }
        break;

      case 'coloniaId':
        console.log(this.coloniaSelected, this.coloniaSelectedId);
        console.log('autocompleteColonia');
        console.log('autocompleteColonia', this.autocompleteColonia.options.first.select());
        console.log('selected', this.autocompleteColonia.optionSelected);

        if(this.coloniaSelected != ''){
          if (!!this.autocompleteColonia && !!this.autocompleteColonia.options && !!this.autocompleteColonia.options.first) {
            if (this.autocompleteColonia.options.first.select() != undefined) {
              this.autocompleteColonia.options.first.select();
            }
          }
        }
        break;


      case 'calleId':
        console.log('chooseFirstOption');
        console.log('autocompleteCalle', this.autocompleteCalle);
        console.log('autocompleteCalle');
        console.log('selected', this.autocompleteCalle.optionSelected);
        if(this.calleSelected == ''){
        if (!!this.autocompleteCalle && !!this.autocompleteCalle.options && !!this.autocompleteCalle.options.first) {
          if (this.autocompleteCalle.options.first.select() != undefined) {
            this.autocompleteCalle.options.first.select();
          }
        }
        }
        break;



      case 'entreCalle1Id':
        if(this.entreCalle1Selected == ''){
        if (!!this.autocompleteEntreCalle1 && !!this.autocompleteEntreCalle1.options && !!this.autocompleteEntreCalle1.options.first) {
          if (this.autocompleteEntreCalle1.options.first.select() != undefined) {
            this.autocompleteEntreCalle1.options.first.select();
          }
        }
        }
        break;




      case 'entreCalle2Id':
        if(this.entreCalle2Selected != ''){
        if (!!this.autocompleteEntreCalle2 && !!this.autocompleteEntreCalle2.options && !!this.autocompleteEntreCalle2.options.first) {
          if (this.autocompleteEntreCalle2.options.first.select() != undefined) {
            this.autocompleteEntreCalle2.options.first.select();
          }
        }
        }
        break;

    }
  }



  focusOutFunction(event: any) {
    let model = event.target['id'];

    switch (model) {

      case 'municipioId':
        if(this.municipioSelected == ''){
          if (!!this.autocompleteMunicipio.options.first) {
            if (!!this.autocompleteMunicipio.options.first.value) {
              this.SelectData(model, this.autocompleteMunicipio.options.first.value);
            }
          }
        }
      
        break;

      case 'localidadModel':
        if (this.localidadSelected == '') {
          if (!!this.autocompleteLocalidad.options.first) {
            if (!!this.autocompleteLocalidad.options.first.value) {
              this.SelectData(model, this.autocompleteLocalidad.options.first.value);
            }
          }

        }
        break;


      case 'coloniaModel':
        if (this.coloniaSelected == '') {

          if (!!this.autocompleteColonia.options.first) {
            if (!!this.autocompleteColonia.options.first.value) {
              this.SelectData(model, this.autocompleteColonia.options.first.value);
              // this.coloniaSelected = this.autocompleteColonia.options.first.value;
              // this.getColoniaID(this.coloniaSelected);
            }
          }
        }
        break;


      //no hay IDs de Calles
      case 'calleModel':
        if (this.calleSelected == '') {
          if (!!this.autocompleteCalle.options.first) {
            if (!!this.autocompleteCalle.options.first.value) {
              this.SelectData(model, this.autocompleteCalle.options.first.value);
              //this.calleSelected = this.autocompleteCalle.options.first.value;
            }
          }
        }
        break;

      case 'entreCalle1Model':
        if (this.entreCalle1Selected == '') {
          if (!!this.autocompleteEntreCalle1.options.first) {
            if (!!this.autocompleteEntreCalle1.options.first.value) {
              this.SelectData(model, this.autocompleteEntreCalle1.options.first.value);
              //this.entreCalle1Selected = this.autocompleteEntreCalle1.options.first.value;
            }
          }
        }

        break;


      case 'entreCalle2Model':
        if (this.entreCalle2Selected == '') {
          if (!!this.autocompleteEntreCalle2.options.first) {
            if (!!this.autocompleteEntreCalle2.options.first.value) {
              this.SelectData(model, this.autocompleteEntreCalle2.options.first.value);
              //this.entreCalle2Selected = this.autocompleteEntreCalle2.options.first.value;
            }
          }
        }
        break;
    }
  }



  trackById(index: number, model: any) {
    return model.id;
  }
  DisplayFn(obj?: any): string | undefined {
    return obj ? obj.nombre : undefined;
  }
  filtrar_acentos(input) {
    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";

    for (var i = 0; i < acentos.length; i++) {
      input = input.replace(acentos.charAt(i), original.charAt(i)).toLowerCase();
    };

    return input;
  }

  EmitObj() {
    this.objOutput = {
      pais: 'MÉXICO',
      estado: 'GUANAJUATO',
      estadoId: '11',
      municipio: this.municipioSelected,
      municipioId: this.municipioSelectedId,
      localidad: this.localidadSelected,
      zona: this.zona,
      cp: this.CP,
      colonia: this.coloniaSelected,
      coloniaId: this.coloniaSelectedId,
      calle: this.calleSelected,
      //calleId: this.CalleId,
      numExt: this.NumExt,
      numInt: this.NumInt,
      entre1: this.entreCalle1Selected,
      entre2: this.entreCalle2Selected
    }
    //console.log(this.objOutput);
    this.dataOutput.emit(this.objOutput);
  }

}

// export function ExisteCP(cp:string): ValidatorFn{
//   return (control:AbstractControl): {[key: string]: boolean} | null =>{
//     console.log(control.value);
//     return null;
//   }
// }



export function forbiddenNamesValidator(Services: any[]): ValidatorFn | null {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const index = Services.findIndex((Service: any) => {
      return Service.nombre.includes(control.value);
    });
    return index < 0 ? { forbiddenNames: { value: control.value } } : null;
  };
}


export class ValidaCPAsync {
  static createValidator(Service: DatosGeograficosService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors> => {
          const cp = control.value as string;
          return Service.getByCp(cp)
              .pipe(
                  map((res: any) => (res.statusCode === 500) ? {noExisteCP:true}: null ),
                  catchError((err, caught) => of({ noExisteCP: true }))
              );
          return of(null);
      };
  }
}