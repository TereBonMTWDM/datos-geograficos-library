import { Component, OnInit, Compiler, ViewChild, Optional, Inject, OnDestroy, ElementRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../services/Registro/registro.service';
import { ConditionalExpr } from '@angular/compiler';
import { NotifierService } from 'angular-notifier';
import { i_anexoPerfil } from "../../interfaces/interfaces";
import { AnexoService } from '../../services/Admin/anexos.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { GeograficosService } from 'src/app/services/geograficos.service';
import { PaisModel, EstadoModel, MunicipioModel, LocalidadModel, ColoniaModel, CodigoPostalModel, CalleModel } from 'src/app/models/geograficosModel';
import { map, startWith, filter, take, debounceTime, distinctUntilChanged, tap, finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service'
import { MatPaginator, MatDialog, MatDialogRef, MatTableDataSource, MatSort, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatAutocomplete, MatTable } from '@angular/material';
declare var google;
import { UsuariosService } from "../../services/Admin/usuarios.service";
import * as moment from 'moment';
import { Select } from '../../models/dynamicForms/FormTypes/select/select.model';
import { Router } from '@angular/router';
import { NgForage } from 'ngforage';
import { Subscription } from 'rxjs/Subscription';
import { ImagenUploadComponent } from '../../modules/ImagenesModule/imagen-upload/imagen-upload.component';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss'],
  providers: [RegistroService],
})
export class RegistroUsuarioComponent implements OnInit, OnDestroy {

  /* #region  #VARIABLES */
  ngUnsubscribe = new Subject<void>();
  private valApellidos = /^[a-zA-Z.ÁÉÍÓÚáéíóúñÑ |]*$/
  private valTel = /^[0-9]{10}$/
  private cp = /^[0-9]*$/
  private latitud = /^[0-9].*$/
  private longitud = /^-[0-9].*$/
  private textoValido = /^\S((?!.*  ).*\S)?$/
  private textoValidoCP = /^\S((?!.* ).*\S)?$/
  private rfcV = /^([A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?)$/;
  private parentCURP = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/




  @ViewChild('completePaisNac', { static: false }) completePaisNac: MatAutocomplete;
  @ViewChild('completeEstado', { static: false }) completeEstado: MatAutocomplete;
  @ViewChild('completeMunicipio', { static: false }) completeMunicipio: MatAutocomplete;
  @ViewChild('completeLocalidad', { static: false }) completeLocalidad: MatAutocomplete;

  @ViewChild('completePaisDom', { static: false }) completePaisDom: MatAutocomplete;
  @ViewChild('completeEstadoDom', { static: false }) completeEstadoDom: MatAutocomplete;
  @ViewChild('completeMunicipioDom', { static: false }) completeMunicipioDom: MatAutocomplete;
  @ViewChild('completeLocalidadDom', { static: false }) completeLocalidadDom: MatAutocomplete;
  @ViewChild('completeCp', { static: false }) completeCp: MatAutocomplete;
  @ViewChild('completeColoniaDom', { static: false }) completeColoniaDom: MatAutocomplete;
  @ViewChild('completeCalleDom', { static: false }) completeCalleDom: MatAutocomplete;


  elementRef: any;
  public isLoading: boolean = true;
  public espera: boolean = false;
  public curpValida: boolean = true;
  public curpValidaIcon: boolean = false;
  public curpNoValida: boolean = false;

  datosRegistro;
  fenway: any;
  map: any;
  panorama: any;
  lat: 20.9874932;
  lng: -101.2845572;
  geocoder: any;
  cordenadas;
  idUsuario;
  onDialog;
  RegistroUsuario;
  tablaAnexos: i_anexoPerfil[];
  postData;
  dataSubs;
  totalRows;
  totalPages;
  valueName;
  valueDesc;


  anoActual = moment(new Date()).format()
  soloAno = this.anoActual.substr(0, 4)
  mes = this.anoActual.substr(5, 2)
  mesFormat = (parseInt(this.mes) - 1)
  dia = this.anoActual.substr(8, 2)
  anoValido = parseInt(this.soloAno) - 18
  maxDate = new Date(this.anoValido, this.mesFormat, parseInt(this.dia));
  minDate = new Date(1920, 0, 1);

  //para cachar valores reales
  public NacPais = '';
  public NacEstado = '';
  public NacMunicipio = '';
  public NacLocalidad = '';

  NacEstadoAbrev = '';
  // NacMunicipio = '';
  DomEstado = '';
  DomEstadoAbrev = '';
  DomMunicipio = '';
  DomLocalidad = '';
  DomCodigoPostal = '';
  DomColonia = '';
  DomCalle = '';
  estadoByRenapo = '';
  municipioByRenapo;
  savePerfilSubscribe;
  datosPersonalesRenapo;
  codigoEntidadRenapo;
  codigoMunicipioRenapo;

  dataUser;
  dataUsuario;

  NR_Pais = 0;
  NR_Estado = 0;
  NR_Localidad = 0;
  NR_Municipio = 0;

  DR_Pais = 0;
  DR_Estado = 0;
  DR_Localidad = 0;
  DR_Municipio = 0;
  DR_Colonia = 0;
  DR_Calle = 0;
  DR_CP = 0;



  //para get data
  paisesNac: PaisModel[];
  estadosNac: EstadoModel[];
  municipiosNac: MunicipioModel[];
  localidadesNac: LocalidadModel[];
  paisesDom: PaisModel[];
  estadosDom: EstadoModel[];
  municipiosDom: MunicipioModel[];
  localidadesDom: LocalidadModel[];
  codigosPostalesDom: CodigoPostalModel[];
  coloniasDom: ColoniaModel[];
  callesDom: CalleModel[];
  //DDL filtrados:
  paisNacFiltred: Observable<PaisModel[]>
  edoNacFiltred: Observable<EstadoModel[]>
  muniNacFiltred: Observable<MunicipioModel[]>
  localNacFiltred: Observable<LocalidadModel[]>
  callesFiltradas: Observable<CalleModel[]>;
  paisDomFiltred: Observable<PaisModel[]>
  edoDomFiltred: Observable<EstadoModel[]>
  muniDomFiltred: Observable<MunicipioModel[]>
  localDomFiltred: Observable<LocalidadModel[]>
  cpDomFiltred: Observable<CodigoPostalModel[]>
  coloniaDomFiltred: Observable<ColoniaModel[]>
  calleDomFiltred: Observable<CalleModel[]>

  // para selected
  paisNacSelectedDef = 'MX';
  paisNacSelected: string = 'MÉXICO';
  estadoNacSelected: string = '';
  municipioNacSelected: string = '';
  localidadNacSelected: string = '';
  paisDomSelected: string = 'MÉXICO';
  estadoDomSelected: string = '';
  municipioDomSelected: string = '';
  localidadDomSelected: string = '';
  cpDomSelected: string = '';
  coloniaDomSelected: string = '';
  calleDomSelected: string = '';
  telMovil: string = '';
  telFijo: string = '';
  numExt: string = '';
  numInt: string = '';
  displayedColumns: string[] = [
    "texto",
    "descripcion",
    "acciones"
  ];

  estadoNacSelectedId: string;
  municipioNacSelectedId: string;
  localidadNacSelectedId: string;
  estadoDomSelectedId: string;
  municipioDomSelectedId: string;
  //localidadDomSelectedId: string;
  cpDomSelectedId: string;
  coloniaDomSelectedId: string;
  userData;
  // calleDomSelectedId: string;

  paisNacControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(70)]);
  edoNacControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(50)]);
  muniNacControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(100)]);
  localidadNacControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.maxLength(100)]);
  edoDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(50)]);
  muniDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(100)]);
  localidadDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.maxLength(100)]);
  cpDomControl = new FormControl('', [Validators.minLength(3), Validators.required, Validators.maxLength(5)]);
  coloniaDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(128)]);
  calleDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(255)]);
  paisDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(70)]);

  roles: any;
  dataSource = null;
  step = 0;
  dataUserSub: Subscription;
  datosGeoSubs: Subscription;
  paisSubs: Subscription;
  estadoSubs: Subscription;
  muniSubs: Subscription;
  localidadSubs: Subscription;
  codigoPostalSubs: Subscription;
  coloniaSubs: Subscription;
  calleSubs: Subscription;
  bucket = 'expedientessfia';


  //para 'nacimiento':
  //nacimiento: NacimientoModel;
  //nacimiento: any[] = [];
  nacimiento: any;  
  domicilio: any;
  curp: any;
  
  objNacimiento: any;
  objDomicilio: any;
  objCurp: any;

  /* #endregion */


  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) exportTable: ElementRef;
  @ViewChild(MatTable, { static: false }) Table: MatTable<any>;
  constructor(
    private dataService: RegistroService,
    private geograficosSvc: GeograficosService,
    private authService: AuthService,
    private _compiler: Compiler,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private usuarioService: UsuariosService,
    private router: Router,
    private dataServiceAnexos: AnexoService,
    private store: NgForage,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegistroUsuarioComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dataModal: any
  ) {
    this.RegistroUsuario = this.formBuilder.group({
      nombreUsuario: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      latitud: '',
      longitud: '',
      RFC: '',
      CURP: '',
      numExtDomicilio: '',
      numIntDomicilio: '',
      telefonoFijo: '',
      telefonoMovil: '',
      sexo: '',
      fechaNacimiento: '',
      abrevEstadoNac: '',
      abrevEstadoDom: '',
      entreCalle1: '',
      entreCalle2: ''
    });
  }

  ELEMENT_DATA: i_anexoPerfil[] = [
    { formato: 'pdf', texto: 'CURP', descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { formato: 'pdf', texto: 'INE', descripcion: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' },
    { formato: 'pdf', texto: 'Acta de nacimiento', descripcion: 'Ornare lectus sit amet est placerat in. Ac orci phasellus egestas tellus rutrum.' },
    { formato: 'pdf', texto: 'Comprobante de domicilio', descripcion: 'Nam aliquam sem et tortor consequat id porta nibh.' },
  ];

  async ngOnInit() {
    //this.getData();
    this.dataAnexosTemp();
    this.dataUser = await this.store.getItem('usrCitas');
    if (this.dataModal.length == 0) {
      this.idUsuario = this.dataUser['idx'];
      this.onDialog = 0;
    } else {
      this.idUsuario = this.dataModal;
      this.onDialog = 1;
    }
    this._compiler.clearCache();
    this.paisNacControl.setValue({ pais: 'MÉXICO' });
    this.paisDomControl.setValue({ pais: 'MÉXICO' });
    this.authService.watchStorage().subscribe((data: string) => {
      this.datosRegistro = data;
    });
    this.dataUserSub = this.usuarioService.getDataPerfil(this.idUsuario).subscribe(
      data => {
        if (data['data'] && data['data'].length > 0) {

          this.dataUsuario = data['data'][0];
          this.asignarByNacimiento();//°!!!!!!!!!!!!!!!!!!!!!!!
          this.asignarByDomicilio();




          if (this.dataUsuario['fechaNac'] == '0001-01-01T00:00:00') {
            this.dataUsuario['fechaNac'] = ''
          }
          (this.dataUsuario['sexoId'] == 0) ? this.dataUsuario['sexoId'] = '' : this.dataUsuario['sexoId'];
          this.RegistroUsuario = new FormGroup({
            nombreUsuario: new FormControl(this.dataUsuario['nombre'], [Validators.required, Validators.pattern(this.textoValido), Validators.maxLength(70), Validators.pattern(this.valApellidos)]),
            apellidoPaterno: new FormControl(this.dataUsuario['apellido1'], [Validators.required, Validators.pattern(this.textoValido), Validators.maxLength(70), Validators.pattern(this.valApellidos)]),
            apellidoMaterno: new FormControl(this.dataUsuario['apellido2'], [Validators.maxLength(70), Validators.pattern(this.textoValido), Validators.pattern(this.valApellidos)]),
            latitud: new FormControl('', [Validators.pattern(this.latitud)]),
            longitud: new FormControl('', [Validators.pattern(this.longitud)]),
            RFC: new FormControl(this.dataUsuario['rfc'], [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(this.rfcV)]),
            CURP: new FormControl(this.dataUsuario['curp'], [Validators.required, Validators.maxLength(18), Validators.pattern(this.parentCURP)]),
            numExtDomicilio: new FormControl(this.dataUsuario['numExt'], [Validators.required, Validators.maxLength(5)]),
            numIntDomicilio: new FormControl(this.dataUsuario['numInt'], [Validators.maxLength(5)]),
            telefonoFijo: new FormControl(this.dataUsuario['telFijo'], [Validators.maxLength(15), Validators.pattern(this.valTel)]),
            telefonoMovil: new FormControl(this.dataUsuario['telMovil'], [Validators.required, Validators.maxLength(15), Validators.pattern(this.valTel)]),
            sexo: new FormControl("" + this.dataUsuario['sexoId'] + "", [Validators.required]),
            fechaNacimiento: new FormControl(this.dataUsuario['fechaNac'], Validators.required),
            abrevEstadoNac: new FormControl(this.dataUsuario['estadoNacAbrev']),
            abrevEstadoDom: new FormControl(this.dataUsuario['estadoDomAbrev']),
            entreCalle1: new FormControl(this.dataUsuario['entre1'], Validators.maxLength(255)),
            entreCalle2: new FormControl(this.dataUsuario['entre2'], Validators.maxLength(255)),
          });

          if (this.dataUsuario['estadoNac']) {
            this.edoNacControl.setValue({ entidad: this.dataUsuario['estadoNac'].toString().trim() });
            this.estadoNacSelected = this.dataUsuario['estadoNac'].toString().trim();
            this.NacEstado = this.dataUsuario['estadoNac'].toString().trim();

          }
          if (this.dataUsuario['municipioNac']) {
            this.muniNacControl.setValue({ municipio: this.dataUsuario['municipioNac'].toString().trim() });
            this.municipioNacSelected = this.dataUsuario['municipioNac'].toString().trim();
            this.NacMunicipio = this.dataUsuario['municipioNac'].toString().trim();
          }
          if (this.dataUsuario['localidadNac']) {
            this.localidadNacControl.setValue({ localidad: this.dataUsuario['localidadNac'].toString().trim() });
            this.localidadNacSelected = this.dataUsuario['localidadNac'].toString().trim();
            this.NacLocalidad = this.dataUsuario['localidadNac'].toString().trim();
          }
          if (this.dataUsuario['estadoDom']) {
            this.edoDomControl.setValue({ entidad: this.dataUsuario['estadoDom'].toString().trim() });
            this.estadoDomSelected = this.dataUsuario['estadoDom'].toString().toString().trim();
            this.DomEstado = this.dataUsuario['estadoDom'].toString().toString().trim();
          }
          if (this.dataUsuario['municipioDom']) {
            this.muniDomControl.setValue({ municipio: this.dataUsuario['municipioDom'].toString().trim() });
            this.municipioDomSelected = this.dataUsuario['municipioDom'].toString().trim();
            this.DomMunicipio = this.dataUsuario['municipioDom'].toString().trim();
          }
          if (this.dataUsuario['localidadDom']) {
            this.localidadDomControl.setValue({ localidad: this.dataUsuario['localidadDom'].toString().trim() });
            this.localidadDomSelected = this.dataUsuario['localidadDom'].toString().trim();
            this.DomLocalidad = this.dataUsuario['localidadDom'].toString().trim();
          }
          if (this.dataUsuario['codigoPostalDom']) {
            this.cpDomControl.setValue({ cp: this.dataUsuario['codigoPostalDom'].toString().trim() });
            this.cpDomSelected = this.dataUsuario['codigoPostalDom'].toString().trim();
            this.DomCodigoPostal = this.dataUsuario['codigoPostalDom'].toString().trim();
          }
          if (this.dataUsuario['coloniaDom']) {
            this.coloniaDomControl.setValue({ colonia: this.dataUsuario['coloniaDom'].toString().trim() });
            this.coloniaDomSelected = this.dataUsuario['coloniaDom'].toString().trim();
            this.DomColonia = this.dataUsuario['coloniaDom'].toString().trim();
          }
          if (this.dataUsuario['calle']) {
            this.calleDomControl.setValue({ vialidad: this.dataUsuario['calle'].toString().trim() });
            this.calleDomSelected = this.dataUsuario['calle'].toString().trim();
            this.DomCalle = this.dataUsuario['calle'].toString().trim();
          }
          if (this.dataUsuario['paisNac'] && this.dataUsuario['paisDom']) {
            this.paisNacControl.setValue({ pais: this.dataUsuario['paisNac'].toString().trim() });
            this.paisNacSelected = this.dataUsuario['paisNac'].toString().trim();
            this.NacPais = this.dataUsuario['paisNac'].toString().trim();

            this.paisDomControl.setValue({ pais: this.dataUsuario['paisDom'].toString().trim() });
            this.paisDomSelected = this.dataUsuario['paisDom'].toString().trim();
          } else {
            this.paisNacControl.setValue({ pais: "MÉXICO" });
            this.paisNacSelected = "MÉXICO";
            this.paisDomControl.setValue({ pais: "MÉXICO" });
            this.paisDomSelected = "MÉXICO"
          }
          // if (this.dataUsuario['paisNac'] && this.dataUsuario['paisDom']){
          //     this.paisNacControl.setValue({ pais: ""+this.dataUsuario['paisNac'].toString().trim()+""});
          //     this.paisNacSelected = this.dataUsuario['paisNac'].toString().trim();
          //   this.paisDomControl.setValue({ pais: "" +this.dataUsuario['paisDom'].toString().trim()+""});
          //     this.paisDomSelected = this.dataUsuario['paisDom'].toString().trim();
          //   if (((("" + this.dataUsuario['paisNac'] + "").trim()) == "")) {
          //     this.paisNacControl.setValue({ pais: "MÉXICO" });
          //     this.paisNacSelected = "MÉXICO";
          //   }
          //   if (((("" + this.dataUsuario['paisDom'] + "").trim()) == "")) {
          //     this.paisDomControl.setValue({ pais: "MÉXICO" });
          //     this.paisDomSelected = "MÉXICO"
          //   }
          // }else{
          //   this.paisNacControl.setValue({ pais: "MÉXICO" });
          //   this.paisNacSelected = "MÉXICO";
          //   this.paisDomControl.setValue({ pais: "MÉXICO" });
          //   this.paisDomSelected = "MÉXICO"
          // }



          if ((!this.dataUsuario['latitud'] || this.dataUsuario['latitud'] == '') && (!this.dataUsuario['longitud'] || this.dataUsuario['longitud'] == '') && (!this.dataUsuario['heading'] || this.dataUsuario['heading'] == '') && (!this.dataUsuario['pitch'] || this.dataUsuario['pitch'] == '')) {
            setTimeout(() => {
              this.streetView();
            }, 500);
          } else {
            setTimeout(() => {
              this.streetViewSet(this.dataUsuario['latitud'], this.dataUsuario['longitud'], this.dataUsuario['heading'], this.dataUsuario['pitch']);
            }, 500);
          }
        }

        // this.getEstados('nac', this.NacEstado);
        // this.getEstados('dom', this.DomEstado);
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar el perfil. Contacta al administrador.'
        );
      }
    );
    // this.getPaises();

  }

  uploadDocs(accion, obj) {
    obj.bucket = this.bucket
    obj.accion = accion

    const dialogRef = this.dialog.open(ImagenUploadComponent, {
      width: '700px', height: '600px',
      data: obj.bucket
    }).afterClosed().subscribe(response => {
      try {
        // if (response.sucess == true && obj.accion == 'Agregar') {
        //   this.postData={
        //     descripcion: obj.descripcion,
        //     extension:response.tipo,
        //     usuarioID: this.dataUser.idx
        //   }
        //   this.dataServiceAnexos.postAnexo(this.postData).subscribe(
        //     result=>{
        //       console.log(result);
        //       if(result['statusCode']==500){
        //         this.notifier.notify(
        //           'error',
        //           'Ha ocurrido un error al intentar guardar. Contacta al administrador.'
        //         );
        //       } else if (result['statusCode'] == 201){
        //         this.notifier.notify(
        //         'success',
        //         'Datos anexos guardados correctamente.'
        //       );
        //       }

        //   },
        //   error=>{
        //     this.notifier.notify(
        //       'error',
        //       'Ha ocurrido un error al intentar guardar. Contacta al administrador.'
        //     );
        //   });
        // } else if (response.success == false){
        //   this.notifier.notify(
        //     'error',
        //     'Ha ocurrido un error al intentar guardar. Contacta al administrador.'
        //   );
        // }
        if (response.sucess == true) {
          this.notifier.notify(
            'success',
            'Datos anexos guardados correctamente.'
          );
        } else if (response.sucess == false) {          
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar guardar. Contacta al administrador.'
          );
        }

      } catch (error) {
        console.log(error);
      }
    })
  }



  ngOnDestroy(): void {
    if (this.savePerfilSubscribe == 1) {
      this.dataUserSub.unsubscribe();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  dataAnexosTemp() {
    this.tablaAnexos = this.ELEMENT_DATA;
    this.dataSource = new MatTableDataSource<i_anexoPerfil>(this.tablaAnexos);
  }

  getData() {
    this.dataSubs = this.dataServiceAnexos.Get(10, 1).subscribe(
      data => {        
        if (data['data'] && data['data'].length > 0) {
          this.tablaAnexos = data['data'];
          this.totalRows = data['pagedData']['totalRows'];
          this.totalPages = data['pagedData']['totalPages']
          this.dataSource = new MatTableDataSource<i_anexoPerfil>(this.tablaAnexos);
          // this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.valueName = '';
          this.valueDesc = '';
        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar cargar los menús. Contacta al administrador.'
        );
      }
    );
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.RegistroUsuario.controls[controlName].hasError(errorName);
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
  omitir() {
    this.router.navigate(['/tramites']);
  }


  /*
  chooseFirstOption(event: any): void {
    let model = event.target['id'];
    switch (model) {
      //NAC:
      case 'paisNacModel':
        if (this.completePaisNac != undefined) { if (this.completePaisNac.options.first.select() != undefined) { this.completePaisNac.options.first.select(); } }
        break;

      case 'estadoNacModel':
        console.log('===ESTADO: ', this.completeEstado);
        if (this.estadoNacSelected != '') {
          if (this.completeEstado != undefined) { if (this.completeEstado.options.first.select() != undefined) { this.completeEstado.options.first.select(); } }
        }

        break;

      case 'municipioNacModel':
        if (this.municipioNacSelected != '') {
          if (this.completeMunicipio != undefined) { if (this.completeMunicipio.options.first.select() != undefined) { this.completeMunicipio.options.first.select(); } }
        }
        break;

      case 'localidadNacModel':
        if (this.localidadNacSelected != '') {
          if (this.completeLocalidad != undefined) { if (this.completeLocalidad.options.first.select() != undefined) { this.completeLocalidad.options.first.select(); } }
        }
        break;



      //DOM:
      case 'paisDomModel':
        if (this.paisDomSelected != '') {
          if (this.completePaisDom != undefined) { if (this.completePaisDom.options.first.select() != undefined) { this.completePaisDom.options.first.select(); } }
        }
        break;

      case 'estadoDomModel':
        if (this.estadoDomSelected != '') {
          if (this.completeEstadoDom != undefined) { if (this.completeEstadoDom.options.first.select() != undefined) { this.completeEstadoDom.options.first.select(); } }
        }
        break;

      case 'municipioDomModel':
        if (this.municipioDomSelected != '') {
          if (this.completeMunicipioDom != undefined) { if (this.completeMunicipioDom.options.first.select() != undefined) { this.completeMunicipioDom.options.first.select(); } }
        }
        break;

      case 'localidadDomModel':
        if (this.localidadDomSelected != '') {
          if (this.completeLocalidadDom != undefined) { if (this.completeLocalidadDom.options.first.select() != undefined) { this.completeLocalidadDom.options.first.select(); } }
        }
        break;

      case 'cpDomModel':
        if (this.cpDomSelected != '') {
          if (this.completeCp != undefined) { if (this.completeCp.options.first.select() != undefined) { this.completeCp.options.first.select(); } }
        }
        break;

      case 'coloniaDomModel':
        if (this.coloniaDomSelected != '') {
          if (this.completeColoniaDom != undefined) { if (this.completeColoniaDom.options.first.select() != undefined) { this.completeColoniaDom.options.first.select(); } }
        }
        break;

      case 'calleDomModel':
        if (this.calleDomSelected != '') { if (this.completeCalleDom != undefined) { if (this.completeCalleDom.options.first != undefined) { if (this.completeCalleDom.options.first.select() != undefined) { this.completeCalleDom.options.first.select(); } } } }
        break;
    }
  }
  */





  getDatosPersonalesRenapo(event: any) {
    this.curpValidaIcon = false;
    this.curpNoValida = false
    if (this.RegistroUsuario.get('CURP').status == "VALID") {
      this.espera = true;
      let curp = this.RegistroUsuario.get('CURP').value;
      this.datosPersonalesRenapo = this.dataService.getDataRenapoSub(curp).subscribe(data => {
        if (data['statusCode'] == 200) {
          this.curpValida = true;
          this.curpValidaIcon = true;
          this.curpNoValida = false;
          this.codigoEntidadRenapo = data['data'][0]['estadoCveNac']
          this.codigoMunicipioRenapo = data['data'][0]['estadoCveNac']
          //this.RegistroUsuario.get('nombreUsuario').value = data['data'][0]['nombre'];
          this.geograficosSvc.getEstados().subscribe(result => {
            this.estadoByRenapo = this.filterEstado(result['data'], this.codigoEntidadRenapo);
            // console.log(this.estadoByRenapo[0]['entidad']);
            // this.geograficosSvc.getMunicipiosByEdo(this.codigoEntidadRenapo).subscribe(municipio => {
            //   this.municipioByRenapo = this.filterMunicipio(municipio['data'], this.codigoEntidadRenapo);
            // });
            let fechaNacimiento = (data['data'][0]['fechaNac']).split("/");
            var fecha = new Date(fechaNacimiento[2], fechaNacimiento[1] - 1, fechaNacimiento[0])
            this.RegistroUsuario.patchValue({
              nombreUsuario: data['data'][0]['nombre'],
              apellidoPaterno: data['data'][0]['apellido1'],
              apellidoMaterno: data['data'][0]['apellido2'],
              fechaNacimiento: fecha,
              sexo: (data['data'][0]['sexo'] == 'H') ? data['data'][0]['sexo'] = "2" : data['data'][0]['sexo'] = "1"
            });

            //para componente INPUTS RENAPO:
            this.curp = {
              apellido1: data['data'][0]['apellido1'],
              apellido2: data['data'][0]['apellido2'],
              nombre: data['data'][0]['nombre'],
              sexo: data['data'][0]['sexo'],
              estadoAbrevNac: data['data'][0]['estadoAbrevNac'],
              estadoCveNac: data['data'][0]['estadoCveNac'],
              fechaNac: data['data'][0]['fechaNac'],
              nacionalidad: data['data'][0]['nacionalidad']
            }







            this.espera = false;
          });
        } else {
          if (data['statusText'] = "Error servicio Renapo: NO EXITOSO; Mensaje: La CURP no se encuentra en la base de datos") {
            this.curpValidaIcon = false;
            this.espera = false;
            this.curpValida = false;
            this.curpNoValida = true;
          } else {
            this.curpValidaIcon = false;
            this.espera = false;
            this.curpValida = true;
            this.curpNoValida = false;
          }

        }
      },
        err => {
          //console.log(err);
        });

    }
  }

  filterEstado = (arr, estadoCveNac) => (arr).filter(estado => estado.entidadID == estadoCveNac)
  //filterMunicipio = (arr, estadoCveNac) => (arr).filter(estado => estado.entidadID == estadoCveNac)

  /* #region  #GET DATOS GEOGRAFICOS */
  /*
  getPaises(inputdata: string = null) {
    var id: string;
    this.paisSubs = this.geograficosSvc.getPaises().pipe(take(1)).subscribe((result: PaisModel) => {
      //===pais Nac:
      this.paisesNac = result.data;

      if (this.paisesNac.length > 0) {
        this.paisNacFiltred = this.paisNacControl.valueChanges.pipe(
          startWith<string | PaisModel>(this.paisNacSelected),
          filter(x => typeof x === 'string'),
          // map(value => typeof value === 'string' ? value : value.pais),
          map(name => name ? this._filter('paisNacModel', name.toString()) : this.paisesNac.slice())
        );
      }

      this.getEstados('nac');



      //===pais domicilio
      this.paisesDom = result.data;

      if (this.paisesDom.length > 0) {
        this.paisDomFiltred = this.paisDomControl.valueChanges.pipe(
          startWith<string | PaisModel>(this.paisDomSelected),
          map(value => typeof value === 'string' ? value : value.pais),
          map(name => name ? this._filter('paisDomModel', name) : this.paisesDom.slice())
        );
      }

      this.getEstados('dom');
    });
  }
  */




  /*
  getEstados(tipo: string, inputdata: string = null) { //se obtiene 4 veces.
    var id: string;
    this.estadoSubs = this.geograficosSvc.getEstados().pipe(take(1)).subscribe((result: EstadoModel) => {
      this.estadosNac = result.data;
      this.estadosDom = result.data;


      if (tipo == 'nac' && inputdata == null) {
        if (this.estadosNac.length > 0) {
          this.edoNacFiltred = this.edoNacControl.valueChanges.pipe(
            startWith<string | EstadoModel>(this.estadoNacSelected),
            // map(value => typeof value === 'string' ? value : this.estadoNacSelected),
            map(value => typeof value === 'string' ? value : value.entidad),
            map(name => name ? this._filter('estadoNacModel', name) : this.estadosNac.slice())
          );

          this.estadosNac.forEach(element => {
            if (this.filtrar_acentos(this.estadoNacSelected.toString().toLowerCase().trim()) == this.filtrar_acentos(element.entidad.toString().toLowerCase().trim())) {
              id = element.entidadID.toString();
              this.estadoNacSelectedId = id;
              this.getMunicipios(tipo, id);
              // this.getMunicipios(tipo, id, this.NacMunicipio);
            }
          });


        }
      }
      // else if (tipo == 'nac' && !!inputdata) {
      //   this.estadosNac = result.data;
      //   if (this.estadosNac.length > 0) {
      //     this.estadosNac.forEach(element => {
      //       if (inputdata.toLowerCase() == element.entidad.toLowerCase()) {
      //         id = element.entidadID.toString();
      //         this.estadoNacSelectedId = id;
      //         this.getMunicipios(tipo, id);
      //         this.getMunicipios(tipo, id, this.NacMunicipio);
      //       }
      //     });
      //   }
      // }



      else if (tipo == 'dom' && inputdata == null) {
        if (this.estadosDom.length > 0) {
          this.edoDomFiltred = this.edoDomControl.valueChanges.pipe(
            startWith<string | EstadoModel>(this.estadoDomSelected),
            map(value => typeof value === 'string' ? value : value.entidad),
            map(name => name ? this._filter('estadoDomModel', name) : this.estadosDom.slice())
          );

          this.estadosDom.forEach(element => {
            if (this.filtrar_acentos(this.estadoDomSelected.toLowerCase().trim()) == this.filtrar_acentos(element.entidad.toLowerCase().trim())) {
              id = element.entidadID.toString();
              this.estadoDomSelectedId = id;
              this.getMunicipios(tipo, id);
              // this.getMunicipios(tipo, id, this.DomMunicipio);
            }
          });
        }
      }

    });
  }
  */



  /*
  getMunicipios(tipo: string, idEstado: string, inputdata: string = null) {
    var id: string;
    this.muniSubs = this.geograficosSvc.getMunicipiosByEdo(idEstado).pipe(take(1)).subscribe((result: MunicipioModel) => {
      this.municipiosNac = result.data;
      this.municipiosDom = result.data;

      if (tipo == 'nac' && inputdata == null) {
        if (this.municipiosNac.length > 0) {
          this.muniNacFiltred = this.muniNacControl.valueChanges.pipe(
            startWith<string | MunicipioModel>(this.municipioNacSelected),
            map(value => typeof value === 'string' ? value : value.municipio),
            map(name => name ? this._filter('municipioNacModel', name) : this.municipiosNac.slice())
          );

          this.municipiosNac.forEach(element => {
            if (this.filtrar_acentos(this.municipioNacSelected.toLowerCase()) == this.filtrar_acentos(element.municipio.toLowerCase())) {
              id = element.municipioID.toString();
              this.municipioNacSelectedId = id;
              this.GetLocalidades(tipo, idEstado, id);
            }
          });
        }
      }
      else if (tipo == 'nac' && !!inputdata) {
        if (this.municipiosNac.length > 0) {
          this.municipiosNac.forEach(element => {
            if (inputdata.toLowerCase() == element.municipio.toLowerCase()) {
              id = element.municipioID.toString();
              this.municipioNacSelected = id;
              this.GetLocalidades(tipo, idEstado, id);
            }
          });
        }
      }




      else if (tipo == 'dom' && inputdata == null) {
        if (this.municipiosDom.length > 0) {
          this.muniDomFiltred = this.muniDomControl.valueChanges.pipe(
            startWith<string | MunicipioModel>(this.municipioDomSelected),
            map(value => typeof value === 'string' ? value : value.municipio),
            map(name => name ? this._filter('municipioDomModel', name) : this.municipiosDom.slice())
          );

          this.municipiosDom.forEach(element => {
            if (this.filtrar_acentos(this.municipioDomSelected.toString().trim().toLowerCase()) == this.filtrar_acentos(element.municipio.toString().trim().toLowerCase())) {
              id = element.municipioID.toString();
              this.municipioDomSelectedId = id;

              this.GetLocalidades(tipo, idEstado, id);
              this.getCP(this.estadoDomSelectedId, this.municipioDomSelectedId);
              this.getColonias(this.estadoDomSelectedId, this.municipioDomSelectedId);
              // this.isLoading = true;
              this.getCalles(this.estadoDomSelectedId, this.municipioDomSelectedId);
            }
          });
        }
      }

    });
  }
  */

  /*
  GetLocalidades(tipo: string, idEstado: string, idMuni: string, inputdata: string = null) { // no necesita inputdata
    var id: string;

    this.localidadSubs = this.geograficosSvc.getLocalidadesByEdoMuni(idEstado, idMuni).pipe(take(1)).subscribe((result: LocalidadModel) => {
      if (tipo == 'nac') {
        this.localidadesNac = result.data;
        if (this.localidadesNac.length > 0) {
          if (this.localidadNacSelected == undefined) { this.localidadNacSelected = ''; }

          this.localNacFiltred = this.localidadNacControl.valueChanges.pipe(
            startWith<string | LocalidadModel>(this.localidadNacSelected),
            map(value => typeof value === 'string' ? value : value.localidad),
            map(name => name ? this._filter('localidadNacModel', name) : this.localidadesNac.slice())
          );
        }
      }
      else if (tipo == 'dom' && inputdata == null) {
        this.localidadesDom = result.data;
        if (this.localidadesDom.length > 0) {
          this.localDomFiltred = this.localidadDomControl.valueChanges.pipe(
            startWith<string | LocalidadModel>(this.localidadDomSelected),
            map(value => typeof value === 'string' ? value : value.localidad),
            map(name => name ? this._filter('localidadDomModel', name) : this.localidadesDom.slice())
          );
        }
      }
    });
  }
  */



  /*
  getCP(idEstado: string, idMuni: string, idCol?: string, inputdata: string = null) {
    var id: string;
    this.codigoPostalSubs = this.geograficosSvc.getCP(idEstado, idMuni, idCol).pipe(take(1)).subscribe((result: CodigoPostalModel) => {
      this.codigosPostalesDom = result.data;

      if (inputdata == null) {
        if (this.codigosPostalesDom != undefined) {
          if (this.codigosPostalesDom.length > 0) {
            this.cpDomFiltred = this.cpDomControl.valueChanges.pipe(
              startWith<string | CodigoPostalModel>(this.cpDomSelected),
              map(value => typeof value === 'string' ? value : value.cp),
              map(name => name ? this._filter('codigoPostalModel', name) : this.codigosPostalesDom.slice())
            );

            this.codigosPostalesDom.forEach(element => {
              if (this.cpDomSelected.toString().trim() == element.cp.toString().trim()) {
                id = element.cp.toString();
                this.cpDomSelectedId = id;
                this.getColonias(idEstado, idMuni, this.cpDomSelectedId);
              }
            });
          }
        }
      }
    });
  }
  */



  /*
  getColonias(idEstado: string, idMuni: string, cp?: string, inputdata: string = null) {
    var id: string;

    this.coloniaSubs = this.geograficosSvc.getColonias(idEstado, idMuni, cp).pipe(take(1)).subscribe((result: ColoniaModel) => {
      this.coloniasDom = result.data;

      if (inputdata == null) {
        if (this.coloniasDom != undefined) {
          if (this.coloniasDom.length > 0) {

            if (this.coloniaDomSelected != '') {
              const found = this.coloniasDom.find(element => element.colonia = this.DomColonia.toString());

              this.coloniaDomFiltred = this.coloniaDomControl.valueChanges.pipe(
                startWith<string | ColoniaModel>(this.DomColonia),
                map(value => typeof value === 'string' ? value : value.colonia),
                map(name => name ? this._filter('coloniaModel', name) : this.coloniasDom.slice())
              );

              this.coloniasDom.forEach(element => {
                if (this.filtrar_acentos(this.coloniaDomSelected.toString().trim()) == this.filtrar_acentos(element.colonia.toString().trim())) {
                  id = element.asentamientoID.toString();
                  this.coloniaDomSelectedId = id;
                  this.getCP(idEstado, idMuni, null, this.coloniaDomSelectedId);
                }
              });
            }
            else {

              this.coloniaDomFiltred = this.coloniaDomControl.valueChanges.pipe(
                startWith<string | ColoniaModel>(this.coloniaDomSelected),
                map(value => typeof value === 'string' ? value : value.colonia),
                map(name => name ? this._filter('coloniaModel', name) : this.coloniasDom.slice())
              );

              this.coloniasDom.forEach(element => {
                if (this.filtrar_acentos(this.coloniaDomSelected.toString().trim()) == this.filtrar_acentos(element.colonia.toString().trim())) {
                  id = element.asentamientoID.toString();
                  this.coloniaDomSelectedId = id;
                  this.getCP(idEstado, idMuni, null, this.coloniaDomSelectedId);
                }
              });
            }
          }
        }
        else {
          // this.notifier.notify('error', 'No se encontró información de las Colonias.');
        }
      }
    });
  }
  */




  /*
  getCalles(idEstado: string, idMuni: string) {
    this.isLoading = true;
    var id: string;
    this.calleSubs = this.geograficosSvc.getVialidades(idEstado, idMuni).pipe(take(1)).subscribe((result: CalleModel) => {
      this.isLoading = false;
      this.callesDom = result.data;
      if (this.callesDom != undefined) {
        if (this.callesDom.length > 0) {
          this.calleDomFiltred = this.calleDomControl
            .valueChanges
            .pipe(
              debounceTime(400), distinctUntilChanged(),
              // tap(() => this.isLoading = true),
              startWith<string | CalleModel>(this.calleDomSelected),
              map(value => typeof value === 'string' ? value : value.vialidad),
              map(name => name ? this._filter('calleModel', name) : this.callesDom.slice()),
              // finalize(() => this.isLoading = false)
              // .pipe(finalize(() => this.isLoading = false),)
            );
        }
      }
    });
  }
  */



  /*
  getCalles(idEstado: string, idMuni: string) {
    var id: string;
    console.log(this.calleDomSelected);
    this.calleSubs = this.geograficosSvc.getVialidades(idEstado, idMuni).pipe(take(1)).subscribe((result: CalleModel) => {
    
    this.isLoading = false;
    this.callesDom = result.data;
    if(this.callesDom != undefined){
      if (this.callesDom.length > 0) {
        this.calleDomFiltred = this.calleDomControl.valueChanges.pipe(
          startWith<string | CalleModel>(this.calleDomSelected),
          map(value => typeof value === 'string' ? value : value.vialidad),
          map(name => name ? this._filter('calleModel', name) : this.callesDom.slice())
        );
      }      
    }
    });
  }
  */



  /* #endregion */




  /*
  private _filter(model: string, value: string): any[] {
    const filterValue = value;
    var word = this.filtrar_acentos(filterValue);

    switch (model) {
      //===nac
      case 'paisNacModel':
        this.paisNacSelected = word;
        return this.paisesNac.filter(option => this.filtrar_acentos(option.pais.toLowerCase()).includes(word));

      case 'estadoNacModel':
        this.estadoNacSelected = word;
        return this.estadosNac.filter(option => this.filtrar_acentos(option.entidad.toLowerCase()).includes(word));

      case 'municipioNacModel':
        this.municipioNacSelected = word;
        return this.municipiosNac.filter(option => this.filtrar_acentos(option.municipio.toLowerCase()).includes(word));

      case 'localidadNacModel':
        this.localidadNacSelected = word;
        return this.localidadesNac.filter(option => this.filtrar_acentos(option.localidad.toLowerCase()).includes(word));

      //====dom
      case 'paisDomModel':
        this.paisDomSelected = word;
        return this.paisesDom.filter(option => this.filtrar_acentos(option.pais.toLowerCase()).includes(word));

      case 'estadoDomModel':
        this.estadoDomSelected = word;
        return this.estadosDom.filter(option => this.filtrar_acentos(option.entidad.toLowerCase()).includes(word));

      case 'municipioDomModel':
        this.municipioDomSelected = word;
        return this.municipiosDom.filter(option => this.filtrar_acentos(option.municipio.toLowerCase()).includes(word));

      case 'localidadDomModel':
        this.localidadDomSelected = word;
        return this.localidadesDom.filter(option => this.filtrar_acentos(option.localidad.toLowerCase()).includes(word));

      case 'codigoPostalModel':
        this.cpDomSelected = word;
        return this.codigosPostalesDom.filter(option => option.cp.toLowerCase().includes(filterValue));

      case 'coloniaModel':
        this.coloniaDomSelected = word;
        return this.coloniasDom.filter(option => this.filtrar_acentos(option.colonia.toLowerCase()).includes(word));

      case 'calleModel':
        this.calleDomSelected = word;
        return this.callesDom.filter(option => this.filtrar_acentos(option.vialidad.toLowerCase()).includes(word));
    }
  }
  */

  onChange(value: any) {
  }

  /*
  onSelectionChanged(event: MatAutocompleteSelectedEvent, model: string) {
    console.log('onSelectionChanged');
    switch (model) {

      //datos nacimiento
      case 'paisNacModel':
        if (this.filtrar_acentos(event.option.value.pais.toString().toLowerCase().trim()) === 'mexico') {
          this.paisNacSelected = this.paisNacControl.value.pais;
        }

        if (this.filtrar_acentos(event.option.value.pais.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.paisNacControl.value.pais.toString().toLowerCase().trim())) {
          this.paisNacSelected = event.option.value.pais;
        }
        break;

      case 'estadoNacModel':
        console.log('onSelectionChanged---estadoNacModel');
        if (this.filtrar_acentos(event.option.value.entidad.toString().toLowerCase().trim()) != this.filtrar_acentos(this.edoNacControl.value.entidad.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.entidad.toString().toLowerCase().trim()) != this.filtrar_acentos(this.NacEstado.toString().toLowerCase().trim())) {

          this.estadoNacSelectedId = event.option.value.entidadID;
          this.NacEstado = event.option.value['entidad']
          this.NacEstadoAbrev = event.option.value['abreviatura']

          if (this.estadoNacSelectedId != undefined) {
            this.municipioNacSelected = "";
            this.localidadNacSelected = "";

            this.muniNacControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(100)]);
            this.localidadNacControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.maxLength(100)]);
            this.localNacFiltred = null;

            this.getMunicipios('nac', this.estadoNacSelectedId);
          }
        }
        break;

      case 'municipioNacModel':
        if (this.filtrar_acentos(event.option.value.municipio.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.muniNacControl.value.municipio.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.municipio.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.NacMunicipio.toString().toLowerCase().trim())) {
          this.municipioNacSelectedId = event.option.value.municipioID;
          this.NacMunicipio = event.option.value['municipio']

          if (this.municipioNacSelectedId != undefined) {
            this.localidadNacSelected = "";
            this.localidadNacControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.maxLength(100)]);

            if (this.municipioNacSelectedId != undefined) {
              // this.localidadNacControl.enable();
              this.GetLocalidades('nac', this.estadoNacSelectedId, this.municipioNacSelectedId)
            }
          }
        }
        break;

      case 'localidadNacModel':
        if (this.filtrar_acentos(event.option.value.localidad.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.localidadNacControl.value.localidad.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.localidad.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.NacLocalidad.toString().toLowerCase().trim())) {
          this.localidadNacSelectedId = event.option.value.localidadID;
        }
        break;



      // ===datos domicilio actual
      case 'paisDomModel':
        if (this.filtrar_acentos(event.option.value.pais.toString().toLowerCase().trim()) === 'mexico') {
          this.paisDomSelected = this.paisNacControl.value.pais;
        }

        if (this.filtrar_acentos(event.option.value.pais.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.paisDomControl.value.pais.toString().toLowerCase().trim())) {
          this.paisDomSelected = event.option.value.pais;
        }
        break;

      case 'estadoDomModel':
        if (this.filtrar_acentos(event.option.value.entidad.toString().toLowerCase().trim()) != this.filtrar_acentos(this.edoDomControl.value.entidad.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.entidad.toString().toLowerCase().trim()) != this.filtrar_acentos(this.DomEstado.toString().toLowerCase().trim())) {

          this.estadoDomSelectedId = event.option.value.entidadID;
          this.DomEstado = event.option.value["entidad"]
          this.DomEstadoAbrev = event.option.value["abreviatura"]

          if (this.estadoDomSelectedId != undefined) {
            this.municipioDomSelected = "";
            this.localidadDomSelected = "";
            this.cpDomSelected = "";
            this.coloniaDomSelected = "";
            this.calleDomSelected = "";

            this.muniDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(100)]);
            this.localidadDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.maxLength(100)]);
            this.cpDomControl = new FormControl('', [Validators.minLength(3), Validators.required, Validators.maxLength(5)]);
            this.coloniaDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(128)]);
            this.calleDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(255)]);

            this.localDomFiltred = null;
            this.cpDomFiltred = null;
            this.coloniaDomFiltred = null;
            this.calleDomFiltred = null;

            this.getMunicipios('dom', this.estadoDomSelectedId);
          }
        }
        break;

      case 'municipioDomModel':
        if (this.filtrar_acentos(event.option.value.municipio.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.muniDomControl.value.municipio.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.municipio.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.DomMunicipio.toString().toLowerCase().trim())) {

          this.municipioDomSelectedId = event.option.value.municipioID;
          this.DomMunicipio = event.option.value["municipio"]

          if (this.municipioDomSelectedId != undefined) {

            this.localidadDomSelected = '';
            this.cpDomSelected = '';
            this.coloniaDomSelected = '';
            this.calleDomSelected = '';

            this.localidadDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.maxLength(100)]);
            this.cpDomControl = new FormControl('', [Validators.minLength(3), Validators.required, Validators.maxLength(5)]);
            this.coloniaDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(128)]);
            this.calleDomControl = new FormControl('', [Validators.minLength(3), Validators.pattern(this.textoValido), Validators.required, Validators.maxLength(255)]);


            this.localDomFiltred = null;
            this.cpDomFiltred = null;
            this.coloniaDomFiltred = null;
            this.calleDomFiltred = null;

            this.GetLocalidades('dom', this.estadoDomSelectedId, this.municipioDomSelectedId);
            this.getCP(this.estadoDomSelectedId, this.municipioDomSelectedId);
            this.getColonias(this.estadoDomSelectedId, this.municipioDomSelectedId);

            // this.isLoading = true;
            this.getCalles(this.estadoDomSelectedId, this.municipioDomSelectedId);

          }
        }
        break;

      case 'localidadDomModel':
        if (this.filtrar_acentos(event.option.value.localidad.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.localidadDomControl.value.localidad.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.localidad.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.DomLocalidad.toString().toLowerCase().trim())) {
          // this.localidadDomSelectedId = event.option.value.localidadID;
          this.localidadDomSelected = event.option.value.localidad;
        }
        break;

      case 'cpDomModel':
        if (event.option.value.cp.toString().trim() !== this.cpDomControl.value.cp.toString().trim()
          || (event.option.value.cp.toString().trim() !== this.DomCodigoPostal.toString().trim())
        ) {
          this.cpDomSelectedId = event.option.value.cp;

          if (this.cpDomSelectedId != undefined) {
            // this.coloniaDomSelected = '';
            //this.calleDomSelected = '';

            // this.coloniaDomControl = new FormControl('', [Validators.required]);
            //this.calleDomControl = new FormControl('', [Validators.minLength(3),Validators.pattern(this.textoValido),Validators.required, Validators.maxLength(255)]);

            this.getColonias(this.estadoDomSelectedId, this.municipioDomSelectedId, this.cpDomSelectedId);
          }
        }

        if (this.coloniaDomSelected = '') {
          this.getColonias(this.estadoDomSelectedId, this.municipioDomSelectedId);
        }
        break;

      case 'coloniaDomModel':
        if (this.filtrar_acentos(event.option.value.colonia.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.coloniaDomControl.value.colonia.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.colonia.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.DomColonia.toString().toLowerCase().trim())) {
          this.coloniaDomSelectedId = event.option.value.asentamientoID;
          this.DomColonia = event.option.value["colonia"]

          if (this.coloniaDomSelectedId != undefined) {
            // this.cpDomControl = new FormControl();
            this.cpDomSelected = "";
            this.getCP(this.estadoDomSelectedId, this.municipioDomSelectedId, this.coloniaDomSelectedId);
          }
        }

        if (this.cpDomSelected = '') {
          this.getCP(this.estadoDomSelectedId, this.municipioDomSelectedId);
        }
        break;

      case 'calleDomModel':
        if (this.filtrar_acentos(event.option.value.vialidad.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.calleDomControl.value.vialidad.toString().toLowerCase().trim())
          || this.filtrar_acentos(event.option.value.vialidad.toString().toLowerCase().trim()) !== this.filtrar_acentos(this.DomCalle.toString().toLowerCase().trim())) {
          this.calleDomSelected = event.option.value.vialidad;
        }
        break;
    }
  }
  */


  /* #region  #DISPLAYS */

  displayFn(pais?: PaisModel): string | undefined {
    return pais ? pais.pais : undefined;
  }

  EdoDisplay(edo?: EstadoModel): string | undefined {
    return edo ? edo.entidad : undefined;
  }

  MuniDisplay(obj?: MunicipioModel): string | undefined {
    return obj ? obj.nombre : undefined;
  }

  LocalidadDisplay(obj?: LocalidadModel): string | undefined {
    return obj ? obj.localidad : undefined;
  }

  CpDisplay(obj?: CodigoPostalModel): string | undefined {
    return obj ? obj.cp : undefined;
  }

  ColoniaDomDisplay(obj?: ColoniaModel): string | undefined {
    return obj ? obj.colonia : undefined;
  }

  CalleDomDisplay(obj?: CalleModel): string | undefined {
    return obj ? obj.vialidad : undefined;
  }
  /* #endregion DISPLAYS*/

  filtrar_acentos(input) {
    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";

    for (var i = 0; i < acentos.length; i++) {
      input = input.replace(acentos.charAt(i), original.charAt(i)).toLowerCase();
    };

    return input;
  }



  /*
  focusOutFunction(event: any) {
    let model = event.target['id'];

    switch (model) {

      case 'cpDomModel':
        if (this.coloniaDomSelected == '') {
          this.getCP(this.estadoDomSelectedId, this.municipioDomSelectedId);
        }
        // if (!!this.estadoDomSelected && !!this.municipioDomSelected && this.cpDomSelected) {
        //   this.getCP(this.estadoDomSelected, this.municipioDomSelected, null, this.cpDomSelected);
        // }
        break;


      case 'coloniaDomModel':
        if (this.cpDomSelected == '') {
          this.getColonias(this.estadoDomSelectedId, this.municipioDomSelectedId);
        }
        // if(!! this.estadoDomSelected && !!this.municipioDomSelected){
        //   this.getColonias(this.estadoDomSelected, this.municipioDomSelected);
        // }        
        break;


      /*
      case 'paisNacModel':
        if (!!this.paisNacSelected) {
          this.getPaises(this.paisNacSelected);
        }
        break;

      case 'estadoNacModel':
        if (!!this.estadoNacSelected) {
          this.getEstados('nac', this.estadoNacSelected);
        }
        break;

      case 'municipioNacModel':
        if (!!this.estadoNacSelected && !!this.municipioNacSelected) {
          this.getMunicipios('nac', this.estadoNacSelected, this.municipioNacSelected);
        }
        break;

      case 'localidadNacModel':
        if (!!this.estadoNacSelected && !!this.municipioNacSelected) {
          this.GetLocalidades('nac', this.estadoNacSelected, this.municipioNacSelected);
        }
        break;

      //dom:
      case 'paisDomModel':
        if (!!this.paisDomSelected) {
          this.getPaises(this.paisDomSelected);
        }
        break;

      case 'estadoDomModel':
        if (!!this.estadoDomSelected) {
          this.getEstados('dom', this.estadoDomSelected);
        }
        break;

      case 'municipioDomModel':
        if (!!this.estadoDomSelected && !!this.municipioDomSelected) {
          this.getMunicipios('dom', this.estadoDomSelected, this.municipioDomSelected);
        }
        break;

      case 'localidadDomModel':
        if (!!this.estadoDomSelected && !!this.municipioDomSelected) {
          this.GetLocalidades('dom', this.estadoDomSelected, this.municipioDomSelected);
        }
        break;

        
      case 'cpDomModel':
        console.log(this.cpDomSelected);
        if (!!this.estadoDomSelected && !!this.municipioDomSelected && this.cpDomSelected) {
          this.getCP(this.estadoDomSelected, this.municipioDomSelected, null, this.cpDomSelected);
        }
        break;

        
      // case 'coloniaDomModel':
      //   if(!! this.estadoDomSelected && !!this.municipioDomSelected){
      //     this.getColonias(this.estadoDomSelected, this.municipioDomSelected);
      //   }        
      //   break;

      case 'calleDomModel':
        if (!!this.estadoDomSelected && !!this.municipioDomSelected) {
          this.isLoading = true;
          this.getCalles(this.estadoDomSelected, this.municipioDomSelected);
        }
        break;
        --
    }
  }
  */


  imprimirValores() {
    this.cordenadas = (this.panorama.getPosition() + '').replace("(", "");
    this.cordenadas = ((this.cordenadas).replace(")", ""))
    this.cordenadas = ((this.cordenadas).replace(" ", ""))
  }



  /* #region  #MAPS */

  streetView() {
    this.fenway = { lat: 20.9874932, lng: -101.2845572 };
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.fenway,
      zoom: 14
    });
    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
      position: this.fenway,
      pov: {
        heading: 90,
        pitch: 10
      },
      visible: true
    });
    this.map.setStreetView(this.panorama);
  }

  streetViewSet(latitud, longitud, heading, pitch) {
    this.fenway = { lat: +latitud, lng: +longitud };
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.fenway,
      zoom: 14
    });
    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
      position: this.fenway,
      pov: {
        heading: +heading,
        pitch: +pitch
      },
      visible: true
    });
    this.map.setStreetView(this.panorama);
  }



  streetViewSend(latitud?, longitud?) {
    this.fenway = { lat: parseFloat(latitud), lng: parseFloat(longitud) };
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.fenway,
      zoom: 14
    });
    this.geocoder = new google.maps.Geocoder();
    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
      position: this.fenway,
      pov: {
        heading: 270,
        pitch: 0
      }
    });
    this.map.setStreetView(this.panorama);
  }



  geocodeAddress(form) {
    (form.numExtDomicilio) ? form.numExtDomicilio : form.numExtDomicilio = ""
    var PaisDom = (this.paisDomControl.value.pais) ? this.paisDomControl.value.pais : this.paisDomControl.value;
    var MunicipioDom = (this.muniDomControl.value.municipio) ? this.muniDomControl.value.municipio : this.muniDomControl.value;
    var LocalidadDom = (this.localidadDomControl.value.localidad) ? this.localidadDomControl.value.localidad : this.localidadDomControl.value;
    var ColoniaDom = (this.coloniaDomControl.value.colonia) ? this.coloniaDomControl.value.colonia : this.coloniaDomControl.value;
    var Calle = (this.calleDomControl.value.vialidad) ? this.calleDomControl.value.vialidad : this.calleDomControl.value;
    var geocoder = new google.maps.Geocoder();
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: this.fenway
    });
    geocoder.geocode({ 'address': "" + PaisDom + ", " + LocalidadDom + " " + ", " + MunicipioDom + ", " + ColoniaDom + ", " + Calle + " " + form.numExtDomicilio + "" }, function (results, status) {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        alert('Dirección no encontrada');
      }
    });
  }
  /* #endregion */




  registroUsuario(form) {

    /* #region  datosPerfil */
    this.cordenadas = (this.panorama.getPosition() + '').replace("(", "");
    this.cordenadas = ((this.cordenadas).replace(")", ""))
    this.cordenadas = ((this.cordenadas).replace(" ", ""))
    this.cordenadas = (this.cordenadas).split(",", 2)

    this.userData = {
      Creador: this.dataUser.idx,
      Nombre: (form.nombreUsuario == null) ? form.nombreUsuario = '' : form.nombreUsuario.toUpperCase(),
      Apellido1: (form.apellidoPaterno == null) ? form.apellidoPaterno = '' : form.apellidoPaterno.toUpperCase(),
      Apellido2: (form.apellidoMaterno == null) ? form.apellidoMaterno = '' : form.apellidoMaterno.toUpperCase(),
      Rfc: (form.RFC == null) ? form.RFC = '' : form.RFC.toUpperCase(),
      Curp: (form.CURP == null) ? form.CURP = '' : form.CURP.toUpperCase(),
      TelMovil: form.telefonoMovil,
      TelFijo: (form.telefonoFijo == null) ? form.telefonoFijo = '' : form.telefonoFijo,
      SexoId: parseInt(form.sexo),
      FechaNac: moment(form.fechaNacimiento).format(),
      PaisNac: (this.paisNacControl.value.pais) ? this.paisNacControl.value.pais : this.paisNacControl.value,
      PaisDom: (this.paisDomControl.value.pais) ? this.paisDomControl.value.pais : this.paisDomControl.value,
      Latitud: this.cordenadas[0],
      Longitud: this.cordenadas[1],
      Heading: "" + this.panorama.getPov().heading + "",
      Pitch: "" + this.panorama.getPov().pitch + "",
    }
    /* #endregion */

    if (this.filtrar_acentos(this.NacPais.toString().toLowerCase().trim()) == 'mexico') {
      //tester:
      if(!!this.objNacimiento){
        this.userData.EstadoNac = this.objNacimiento["estado"];
        this.userData.EstadoNacAbrev = (this.objNacimiento["estado"] = '') ? this.objNacimiento["estado"] : form.abrevEstadoNac;
        this.userData.municipioNac = this.objNacimiento["municipio"];
        this.userData.localidadNac = this.objNacimiento["localidad"];
        
      }
      else{
        this.userData.EstadoNac = this.NacEstado;
        this.userData.EstadoNacAbrev = (this.NacEstadoAbrev = '') ? this.NacEstadoAbrev : form.abrevEstadoNac;
        this.userData.municipioNac = (this.muniNacControl.value.municipio) ? this.muniNacControl.value.municipio : this.muniNacControl.value;
        this.userData.localidadNac = (this.localidadNacControl.value.localidad) ? this.localidadNacControl.value.localidad : this.localidadNacControl.value;
        
      }



      if(!!this.objDomicilio){
        this.userData.EstadoDom = this.objDomicilio["estado"];
        this.userData.EstadoDomAbrevAbrev = (this.objDomicilio["estado"] = '') ? this.objDomicilio["estado"] : form.abrevEstadoDom;
        this.userData.municipioDom = this.objDomicilio["municipio"];
        this.userData.localidadDom = this.objDomicilio["localidad"];
        this.userData.CodigoPostalDom = this.objDomicilio["cp"];
        this.userData.coloniaDom = this.objDomicilio["colonia"];
        this.userData.Calle = this.objDomicilio["calle"];
        this.userData.NumExt= this.objDomicilio["numExt"];
        this.userData.NumInt= this.objDomicilio["numInt"];
        this.userData.Entre1 = this.objDomicilio["entre1"];
        this.userData.Entre2 = this.objDomicilio["entre2"];
      }
      else{
        this.userData.EstadoDomAbrev= "" + this.DomEstadoAbrev + "";
        this.userData.EstadoDom= (this.edoDomControl.value) ? this.edoDomControl.value.entidad : this.edoDomControl.value;
        this.userData.MunicipioDom= (this.muniDomControl.value.municipio) ? this.muniDomControl.value.municipio : this.muniDomControl.value;
        this.userData.LocalidadDom= (this.localidadDomControl.value.localidad) ? this.localidadDomControl.value.localidad : this.localidadDomControl.value;
        this.userData.CodigoPostalDom= (this.cpDomControl.value.cp) ? this.cpDomControl.value.cp : this.cpDomControl.value;
        this.userData.ColoniaDom= (this.coloniaDomControl.value.colonia) ? this.coloniaDomControl.value.colonia : this.coloniaDomControl.value;
        this.userData.Calle= (this.calleDomControl.value.vialidad) ? this.calleDomControl.value.vialidad : this.calleDomControl.value;
        this.userData.NumExt= (form.numExtDomicilio == null) ? form.numExtDomicilio = '' : form.numExtDomicilio;
        this.userData.NumInt= (form.numIntDomicilio == null) ? form.numIntDomicilio = '' : form.numIntDomicilio;
        this.userData.Entre1= (form.entreCalle1 == null) ? form.entreCalle1 = '' : form.entreCalle1;
        this.userData.Entre2= (form.entreCalle2 == null) ? form.entreCalle2 = '' : form.entreCalle2;
      }
      

      // this.userData.EstadoDom = this.DomEstado;
      // this.userData.EstadoDomAbrevAbrev = (this.DomEstadoAbrev = '') ? this.DomEstadoAbrev : form.abrevEstadoDom;
      // this.userData.municipioDom = this.DomMunicipio;
      // this.userData.localidadDom = this.DomLocalidad;



      //los demás combos: 
      
     
      

      console.log("registroUsuario -> this.userData", this.userData)

      //extras:
      this.RegistroUsuario.get('numExtDomicilio').setValidators([Validators.maxLength(5), Validators.required]); // or clearValidators()
      this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
      this.RegistroUsuario.get('numIntDomicilio').setValidators([Validators.maxLength(5)]); // or clearValidators()
      this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();
      this.RegistroUsuario.get('entreCalle1').setValidators([Validators.maxLength(255)]); // or clearValidators()
      this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
      this.RegistroUsuario.get('entreCalle2').setValidators([Validators.maxLength(255)]); // or clearValidators()
      this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();


      if (this.RegistroUsuario.valid == true) {
        this.valCurp();
      } else {
        this.errorSavePerfil();
      }
    }
    else {
      //elimina datos de México
      console.log('NO es méxico');
    }




    /*
    this.cordenadas = (this.panorama.getPosition() + '').replace("(", "");
    this.cordenadas = ((this.cordenadas).replace(")", ""))
    this.cordenadas = ((this.cordenadas).replace(" ", ""))
    this.cordenadas = (this.cordenadas).split(",", 2)

    if (!this.NacEstadoAbrev || this.NacEstadoAbrev == null || this.NacEstadoAbrev == '') {
      if (form.abrevEstadoNac != "" && !this.NacEstadoAbrev || form.abrevEstadoNac != null) {
        this.NacEstadoAbrev = form.abrevEstadoNac;
      }
      if (!this.NacEstadoAbrev || !form.abrevEstadoNac) {
        this.NacEstadoAbrev = ""
      }
    }

    if (!this.DomEstadoAbrev || this.DomEstadoAbrev == null || this.DomEstadoAbrev == '') {
      if (form.abrevEstadoDom != "" && !this.DomEstadoAbrev || form.abrevEstadoDom != null) {
        this.DomEstadoAbrev = form.abrevEstadoDom;
      }
      if (!this.DomEstadoAbrev || !form.abrevEstadoDom) {
        this.DomEstadoAbrev = ""
      }
    }
    this.userData = {
      Creador: this.dataUser.idx,
      Nombre: (form.nombreUsuario == null) ? form.nombreUsuario = '' : form.nombreUsuario.toUpperCase(),
      Apellido1: (form.apellidoPaterno == null) ? form.apellidoPaterno = '' : form.apellidoPaterno.toUpperCase(),
      Apellido2: (form.apellidoMaterno == null) ? form.apellidoMaterno = '' : form.apellidoMaterno.toUpperCase(),
      Rfc: (form.RFC == null) ? form.RFC = '' : form.RFC.toUpperCase(),
      Curp: (form.CURP == null) ? form.CURP = '' : form.CURP.toUpperCase(),
      TelMovil: form.telefonoMovil,
      TelFijo: (form.telefonoFijo == null) ? form.telefonoFijo = '' : form.telefonoFijo,
      SexoId: parseInt(form.sexo),
      FechaNac: moment(form.fechaNacimiento).format(),
      PaisNac: (this.paisNacControl.value.pais) ? this.paisNacControl.value.pais : this.paisNacControl.value,
      PaisDom: (this.paisDomControl.value.pais) ? this.paisDomControl.value.pais : this.paisDomControl.value,
      Latitud: this.cordenadas[0],
      Longitud: this.cordenadas[1],
      Heading: "" + this.panorama.getPov().heading + "",
      Pitch: "" + this.panorama.getPov().pitch + "",
    }

    if ((this.paisNacControl.value.pais == 'MÉXICO') && (this.paisDomControl.value.pais == 'MÉXICO')) {
      this.RegistroUsuario.get('numExtDomicilio').setValidators([Validators.maxLength(5), Validators.required]); // or clearValidators()
      this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
      this.RegistroUsuario.get('numIntDomicilio').setValidators([Validators.maxLength(5)]); // or clearValidators()
      this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();
      this.RegistroUsuario.get('entreCalle1').setValidators([Validators.maxLength(255)]); // or clearValidators()
      this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
      this.RegistroUsuario.get('entreCalle2').setValidators([Validators.maxLength(255)]); // or clearValidators()
      this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();

      this.userData.EstadoNacAbrev= "" + this.NacEstadoAbrev + "";
      
      console.log("registroUsuario -> this.NacEstado", this.NacEstado)
      //this.userData.EstadoNac= (this.edoNacControl.value.entidad) ? this.edoNacControl.value.entidad : this.edoNacControl.value; //---previous
      this.userData.EstadoNac= this.NacEstado; //--current


      this.userData.MunicipioNac= (this.muniNacControl.value.municipio) ? this.muniNacControl.value.municipio : this.muniNacControl.value;
      this.userData.LocalidadNac= (this.localidadNacControl.value.localidad) ? this.localidadNacControl.value.localidad : this.localidadNacControl.value;
      this.userData.EstadoDomAbrev= "" + this.DomEstadoAbrev + "",
      this.userData.EstadoDom= (this.edoDomControl.value) ? this.edoDomControl.value.entidad : this.edoDomControl.value;
      this.userData.MunicipioDom= (this.muniDomControl.value.municipio) ? this.muniDomControl.value.municipio : this.muniDomControl.value;
      this.userData.LocalidadDom= (this.localidadDomControl.value.localidad) ? this.localidadDomControl.value.localidad : this.localidadDomControl.value;
      this.userData.CodigoPostalDom= (this.cpDomControl.value.cp) ? this.cpDomControl.value.cp : this.cpDomControl.value;
      this.userData.ColoniaDom= (this.coloniaDomControl.value.colonia) ? this.coloniaDomControl.value.colonia : this.coloniaDomControl.value;
      this.userData.Calle= (this.calleDomControl.value.vialidad) ? this.calleDomControl.value.vialidad : this.calleDomControl.value;
      this.userData.NumExt= (form.numExtDomicilio == null) ? form.numExtDomicilio = '' : form.numExtDomicilio;
      this.userData.NumInt= (form.numIntDomicilio == null) ? form.numIntDomicilio = '' : form.numIntDomicilio;
      this.userData.Entre1= (form.entreCalle1 == null) ? form.entreCalle1 = '' : form.entreCalle1;
      this.userData.Entre2= (form.entreCalle2 == null) ? form.entreCalle2 = '' : form.entreCalle2;

      if (this.RegistroUsuario.valid == true && this.edoNacControl.valid == true && this.muniNacControl.valid == true && this.edoDomControl.valid == true && this.muniDomControl.valid == true && this.cpDomControl.valid == true && this.coloniaDomControl.valid == true && this.calleDomControl.valid == true && this.paisNacControl.valid == true && this.paisDomControl.valid) {
        this.valCurp();
      } else {
        this.errorSavePerfil();
      }
    } else {
      if ((this.paisNacControl.value.pais != 'MÉXICO') && (this.paisDomControl.value.pais == 'MÉXICO')) {

        



        this.RegistroUsuario.get('numExtDomicilio').setValidators([Validators.maxLength(5), Validators.required]); // or clearValidators()
        this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
        this.RegistroUsuario.get('numIntDomicilio').setValidators([Validators.maxLength(5)]); // or clearValidators()
        this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();

        this.RegistroUsuario.get('entreCalle1').setValidators([Validators.maxLength(255)]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
        this.RegistroUsuario.get('entreCalle2').setValidators([Validators.maxLength(255)]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();
        this.userData.EstadoNacAbrev = "";
        this.userData.EstadoNac= "";
        this.userData.MunicipioNac = "";
        this.userData.LocalidadNac = "";
        this.userData.EstadoDomAbrev= "" + this.DomEstadoAbrev + "",
        this.userData.EstadoDom = (this.edoDomControl.value) ? this.edoDomControl.value.entidad : this.edoDomControl.value;
        this.userData.MunicipioDom = (this.muniDomControl.value.municipio) ? this.muniDomControl.value.municipio : this.muniDomControl.value;
        this.userData.LocalidadDom = (this.localidadDomControl.value.localidad) ? this.localidadDomControl.value.localidad : this.localidadDomControl.value;
        this.userData.CodigoPostalDom = (this.cpDomControl.value.cp) ? this.cpDomControl.value.cp : this.cpDomControl.value;
        this.userData.ColoniaDom = (this.coloniaDomControl.value.colonia) ? this.coloniaDomControl.value.colonia : this.coloniaDomControl.value;
        this.userData.Calle = (this.calleDomControl.value.vialidad) ? this.calleDomControl.value.vialidad : this.calleDomControl.value;
        this.userData.NumExt = (form.numExtDomicilio == null) ? form.numExtDomicilio = '' : form.numExtDomicilio;
        this.userData.NumInt = (form.numIntDomicilio == null) ? form.numIntDomicilio = '' : form.numIntDomicilio;
        this.userData.Entre1 = (form.entreCalle1 == null) ? form.entreCalle1 = '' : form.entreCalle1;
        this.userData.Entre2 = (form.entreCalle2 == null) ? form.entreCalle2 = '' : form.entreCalle2;
        if (this.RegistroUsuario.valid == true && this.edoDomControl.valid == true && this.muniDomControl.valid == true && this.cpDomControl.valid == true && this.coloniaDomControl.valid == true && this.calleDomControl.valid == true && this.paisNacControl.valid == true && this.paisDomControl.valid) {
          this.valCurp();
        } else {
          this.errorSavePerfil();
        }
      }

      //
      if ((this.paisNacControl.value.pais == 'MÉXICO') && (this.paisDomControl.value.pais != 'MÉXICO')) {
        this.RegistroUsuario.get('numExtDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
        this.RegistroUsuario.get('numIntDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();

        this.RegistroUsuario.get('entreCalle1').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
        this.RegistroUsuario.get('entreCalle2').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();
        this.userData.EstadoNacAbrev = "" + this.NacEstadoAbrev + "";
        this.userData.EstadoNac = (this.edoNacControl.value.entidad) ? this.edoNacControl.value.entidad : this.edoNacControl.value;
        this.userData.MunicipioNac = (this.muniNacControl.value.municipio) ? this.muniNacControl.value.municipio : this.muniNacControl.value;
        this.userData.LocalidadNac = (this.localidadNacControl.value.localidad) ? this.localidadNacControl.value.localidad : this.localidadNacControl.value;
        this.userData.EstadoDom = "";
        this.userData.MunicipioDom = "";
        this.userData.EstadoDomAbrev= "",
        this.userData.LocalidadDom = "";
        this.userData.CodigoPostalDom = "";
        this.userData.ColoniaDom = "";
        this.userData.Calle = "";
        this.userData.NumExt = "";
        this.userData.NumInt = "";
        this.userData.Entre1 = "";
        this.userData.Entre2 = "";
        if (this.RegistroUsuario.valid == true && this.edoNacControl.valid == true && this.muniNacControl.valid == true) {
          this.valCurp();
        } else {
          this.errorSavePerfil();
        }
      }

      if ((this.paisNacControl.value.pais != 'MÉXICO') && (this.paisDomControl.value.pais != 'MÉXICO')) {
        this.RegistroUsuario.get('numExtDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
        this.RegistroUsuario.get('numIntDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();

        this.RegistroUsuario.get('entreCalle1').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
        this.RegistroUsuario.get('entreCalle2').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();
        this.userData.EstadoNacAbrev = "";
        this.userData.EstadoNac = "";
        this.userData.MunicipioNac = "";
        this.userData.LocalidadNac = "";
        this.userData.EstadoDom = "";
        this.userData.MunicipioDom = "";
        this.userData.EstadoDomAbrev = "",
        this.userData.LocalidadDom = "";
        this.userData.CodigoPostalDom = "";
        this.userData.ColoniaDom = "";
        this.userData.Calle = "";
        this.userData.NumExt = "";
        this.userData.NumInt = "";
        this.userData.Entre1 = "";
        this.userData.Entre2 = "";
        if (this.RegistroUsuario.valid == true) {
          this.valCurp();
        } else {
          this.errorSavePerfil();
        }
      }
    }
    */
  }


  registroUsuario_2(form) {
    console.log(this.NacPais);
    console.log(this.paisNacControl.value.pais);




    this.cordenadas = (this.panorama.getPosition() + '').replace("(", "");
    this.cordenadas = ((this.cordenadas).replace(")", ""))
    this.cordenadas = ((this.cordenadas).replace(" ", ""))
    this.cordenadas = (this.cordenadas).split(",", 2)

    if (!this.NacEstadoAbrev || this.NacEstadoAbrev == null || this.NacEstadoAbrev == '') {
      if (form.abrevEstadoNac != "" && !this.NacEstadoAbrev || form.abrevEstadoNac != null) {
        this.NacEstadoAbrev = form.abrevEstadoNac;
      }
      if (!this.NacEstadoAbrev || !form.abrevEstadoNac) {
        this.NacEstadoAbrev = ""
      }
    }

    if (!this.DomEstadoAbrev || this.DomEstadoAbrev == null || this.DomEstadoAbrev == '') {
      if (form.abrevEstadoDom != "" && !this.DomEstadoAbrev || form.abrevEstadoDom != null) {
        this.DomEstadoAbrev = form.abrevEstadoDom;
      }
      if (!this.DomEstadoAbrev || !form.abrevEstadoDom) {
        this.DomEstadoAbrev = ""
      }
    }
    this.userData = {
      Creador: this.dataUser.idx,
      Nombre: (form.nombreUsuario == null) ? form.nombreUsuario = '' : form.nombreUsuario.toUpperCase(),
      Apellido1: (form.apellidoPaterno == null) ? form.apellidoPaterno = '' : form.apellidoPaterno.toUpperCase(),
      Apellido2: (form.apellidoMaterno == null) ? form.apellidoMaterno = '' : form.apellidoMaterno.toUpperCase(),
      Rfc: (form.RFC == null) ? form.RFC = '' : form.RFC.toUpperCase(),
      Curp: (form.CURP == null) ? form.CURP = '' : form.CURP.toUpperCase(),
      TelMovil: form.telefonoMovil,
      TelFijo: (form.telefonoFijo == null) ? form.telefonoFijo = '' : form.telefonoFijo,
      SexoId: parseInt(form.sexo),
      FechaNac: moment(form.fechaNacimiento).format(),
      PaisNac: (this.paisNacControl.value.pais) ? this.paisNacControl.value.pais : this.paisNacControl.value,
      PaisDom: (this.paisDomControl.value.pais) ? this.paisDomControl.value.pais : this.paisDomControl.value,
      Latitud: this.cordenadas[0],
      Longitud: this.cordenadas[1],
      Heading: "" + this.panorama.getPov().heading + "",
      Pitch: "" + this.panorama.getPov().pitch + "",
    }

    if ((this.paisNacControl.value.pais == 'MÉXICO') && (this.paisDomControl.value.pais == 'MÉXICO')) {
      this.RegistroUsuario.get('numExtDomicilio').setValidators([Validators.maxLength(5), Validators.required]); // or clearValidators()
      this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
      this.RegistroUsuario.get('numIntDomicilio').setValidators([Validators.maxLength(5)]); // or clearValidators()
      this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();
      this.RegistroUsuario.get('entreCalle1').setValidators([Validators.maxLength(255)]); // or clearValidators()
      this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
      this.RegistroUsuario.get('entreCalle2').setValidators([Validators.maxLength(255)]); // or clearValidators()
      this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();

      this.userData.EstadoNacAbrev = "" + this.NacEstadoAbrev + "";

      console.log("registroUsuario -> this.NacEstado", this.NacEstado)
      //this.userData.EstadoNac= (this.edoNacControl.value.entidad) ? this.edoNacControl.value.entidad : this.edoNacControl.value; //---previous
      this.userData.EstadoNac = this.NacEstado; //--current


      this.userData.MunicipioNac = (this.muniNacControl.value.municipio) ? this.muniNacControl.value.municipio : this.muniNacControl.value;
      this.userData.LocalidadNac = (this.localidadNacControl.value.localidad) ? this.localidadNacControl.value.localidad : this.localidadNacControl.value;
      this.userData.EstadoDomAbrev = "" + this.DomEstadoAbrev + "",
        this.userData.EstadoDom = (this.edoDomControl.value) ? this.edoDomControl.value.entidad : this.edoDomControl.value;
      this.userData.MunicipioDom = (this.muniDomControl.value.municipio) ? this.muniDomControl.value.municipio : this.muniDomControl.value;
      this.userData.LocalidadDom = (this.localidadDomControl.value.localidad) ? this.localidadDomControl.value.localidad : this.localidadDomControl.value;
      this.userData.CodigoPostalDom = (this.cpDomControl.value.cp) ? this.cpDomControl.value.cp : this.cpDomControl.value;
      this.userData.ColoniaDom = (this.coloniaDomControl.value.colonia) ? this.coloniaDomControl.value.colonia : this.coloniaDomControl.value;
      this.userData.Calle = (this.calleDomControl.value.vialidad) ? this.calleDomControl.value.vialidad : this.calleDomControl.value;
      this.userData.NumExt = (form.numExtDomicilio == null) ? form.numExtDomicilio = '' : form.numExtDomicilio;
      this.userData.NumInt = (form.numIntDomicilio == null) ? form.numIntDomicilio = '' : form.numIntDomicilio;
      this.userData.Entre1 = (form.entreCalle1 == null) ? form.entreCalle1 = '' : form.entreCalle1;
      this.userData.Entre2 = (form.entreCalle2 == null) ? form.entreCalle2 = '' : form.entreCalle2;

      if (this.RegistroUsuario.valid == true && this.edoNacControl.valid == true && this.muniNacControl.valid == true && this.edoDomControl.valid == true && this.muniDomControl.valid == true && this.cpDomControl.valid == true && this.coloniaDomControl.valid == true && this.calleDomControl.valid == true && this.paisNacControl.valid == true && this.paisDomControl.valid) {
        this.valCurp();
      } else {
        this.errorSavePerfil();
      }
    } else {
      if ((this.paisNacControl.value.pais != 'MÉXICO') && (this.paisDomControl.value.pais == 'MÉXICO')) {





        this.RegistroUsuario.get('numExtDomicilio').setValidators([Validators.maxLength(5), Validators.required]); // or clearValidators()
        this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
        this.RegistroUsuario.get('numIntDomicilio').setValidators([Validators.maxLength(5)]); // or clearValidators()
        this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();

        this.RegistroUsuario.get('entreCalle1').setValidators([Validators.maxLength(255)]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
        this.RegistroUsuario.get('entreCalle2').setValidators([Validators.maxLength(255)]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();
        this.userData.EstadoNacAbrev = "";
        this.userData.EstadoNac = "";
        this.userData.MunicipioNac = "";
        this.userData.LocalidadNac = "";
        this.userData.EstadoDomAbrev = "" + this.DomEstadoAbrev + "",
          this.userData.EstadoDom = (this.edoDomControl.value) ? this.edoDomControl.value.entidad : this.edoDomControl.value;
        this.userData.MunicipioDom = (this.muniDomControl.value.municipio) ? this.muniDomControl.value.municipio : this.muniDomControl.value;
        this.userData.LocalidadDom = (this.localidadDomControl.value.localidad) ? this.localidadDomControl.value.localidad : this.localidadDomControl.value;
        this.userData.CodigoPostalDom = (this.cpDomControl.value.cp) ? this.cpDomControl.value.cp : this.cpDomControl.value;
        this.userData.ColoniaDom = (this.coloniaDomControl.value.colonia) ? this.coloniaDomControl.value.colonia : this.coloniaDomControl.value;
        this.userData.Calle = (this.calleDomControl.value.vialidad) ? this.calleDomControl.value.vialidad : this.calleDomControl.value;
        this.userData.NumExt = (form.numExtDomicilio == null) ? form.numExtDomicilio = '' : form.numExtDomicilio;
        this.userData.NumInt = (form.numIntDomicilio == null) ? form.numIntDomicilio = '' : form.numIntDomicilio;
        this.userData.Entre1 = (form.entreCalle1 == null) ? form.entreCalle1 = '' : form.entreCalle1;
        this.userData.Entre2 = (form.entreCalle2 == null) ? form.entreCalle2 = '' : form.entreCalle2;
        if (this.RegistroUsuario.valid == true && this.edoDomControl.valid == true && this.muniDomControl.valid == true && this.cpDomControl.valid == true && this.coloniaDomControl.valid == true && this.calleDomControl.valid == true && this.paisNacControl.valid == true && this.paisDomControl.valid) {
          this.valCurp();
        } else {
          this.errorSavePerfil();
        }
      }

      //
      if ((this.paisNacControl.value.pais == 'MÉXICO') && (this.paisDomControl.value.pais != 'MÉXICO')) {
        this.RegistroUsuario.get('numExtDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
        this.RegistroUsuario.get('numIntDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();

        this.RegistroUsuario.get('entreCalle1').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
        this.RegistroUsuario.get('entreCalle2').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();
        this.userData.EstadoNacAbrev = "" + this.NacEstadoAbrev + "";
        this.userData.EstadoNac = (this.edoNacControl.value.entidad) ? this.edoNacControl.value.entidad : this.edoNacControl.value;
        this.userData.MunicipioNac = (this.muniNacControl.value.municipio) ? this.muniNacControl.value.municipio : this.muniNacControl.value;
        this.userData.LocalidadNac = (this.localidadNacControl.value.localidad) ? this.localidadNacControl.value.localidad : this.localidadNacControl.value;
        this.userData.EstadoDom = "";
        this.userData.MunicipioDom = "";
        this.userData.EstadoDomAbrev = "",
          this.userData.LocalidadDom = "";
        this.userData.CodigoPostalDom = "";
        this.userData.ColoniaDom = "";
        this.userData.Calle = "";
        this.userData.NumExt = "";
        this.userData.NumInt = "";
        this.userData.Entre1 = "";
        this.userData.Entre2 = "";
        if (this.RegistroUsuario.valid == true && this.edoNacControl.valid == true && this.muniNacControl.valid == true) {
          this.valCurp();
        } else {
          this.errorSavePerfil();
        }
      }

      if ((this.paisNacControl.value.pais != 'MÉXICO') && (this.paisDomControl.value.pais != 'MÉXICO')) {
        this.RegistroUsuario.get('numExtDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numExtDomicilio').updateValueAndValidity();
        this.RegistroUsuario.get('numIntDomicilio').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('numIntDomicilio').updateValueAndValidity();

        this.RegistroUsuario.get('entreCalle1').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle1').updateValueAndValidity();
        this.RegistroUsuario.get('entreCalle2').setValidators([]); // or clearValidators()
        this.RegistroUsuario.get('entreCalle2').updateValueAndValidity();
        this.userData.EstadoNacAbrev = "";
        this.userData.EstadoNac = "";
        this.userData.MunicipioNac = "";
        this.userData.LocalidadNac = "";
        this.userData.EstadoDom = "";
        this.userData.MunicipioDom = "";
        this.userData.EstadoDomAbrev = "",
          this.userData.LocalidadDom = "";
        this.userData.CodigoPostalDom = "";
        this.userData.ColoniaDom = "";
        this.userData.Calle = "";
        this.userData.NumExt = "";
        this.userData.NumInt = "";
        this.userData.Entre1 = "";
        this.userData.Entre2 = "";
        if (this.RegistroUsuario.valid == true) {
          this.valCurp();
        } else {
          this.errorSavePerfil();
        }
      }
    }
  }



  valCurp() {
    if (this.curpValida == true) {
      this.savePerfil(this.userData, this.idUsuario);
    } else {
      window.scrollTo({
        top: 220,
        left: 500,
        behavior: 'smooth'
      });
      this.notifier.notify(
        'error',
        'La CURP que ingreso no existe'
      );
    }
  }

  errorSavePerfil() {
    window.scrollTo({
      top: 220,
      left: 500,
      behavior: 'smooth'
    });
    //this.scrollTo(document.body, 0, 1250);
    this.notifier.notify(
      'error',
      'Revisa la información capturada.'
    );
  }



  savePerfil(userData, idUser) {
    this.savePerfilSubscribe = 1;
    this.usuarioService.savePerfil(userData, idUser).subscribe(
      result => {
        //console.log("savePerfil -> result", result)
        if (result['statusCode'] == 500) {
          this.notifier.notify(
            'error',
            'Ha ocurrido un error al intentar guardar. Contacta al administrador.'
          );
        } else {
          this.notifier.notify(
            'success',
            'La información se ha guardado correctamente'
          );
          if (this.onDialog == 0) {
            this.router.navigate(['/tramites']);
          }

        }
      },
      error => {
        this.notifier.notify(
          'error',
          'Ha ocurrido un error al intentar guardar. Contacta al administrador.'
        );
      }
    );
  }

  /* #region  #TrackBy */
  trackByIdPais(index: number, model: PaisModel) {
    return model.paisID;
  }

  trackByIdEstado(index: number, model: EstadoModel) {
    return model.entidadID;
  }

  trackByIdMunicipio(index: number, model: MunicipioModel) {
    return model.id;
  }

  trackByIdColonia(index: number, model: ColoniaModel) {
    return model.asentamientoID;
  }

  /* #endregion */


  // onNacEstado(event){
  //   console.log("onNacEstado -> event", event)
  //   return 'aaa';

  // }

  on(value) {
    return value;
  }

  onDatosGeograficos(event: string, model: string) {
    switch (model) {
      case "NacPais":
        this.NacPais = event["nombre"];
        break;
        
      case "NacEstado":
          this.NacEstado = event["nombre"];
          this.estadoNacSelectedId = event["id"];
        break;

        
      case "NacMunicipio":
        this.NacMunicipio = event["nombre"];
        this.municipioNacSelectedId = event["id"];
        break;

      case "NacLocalidad":
        this.NacLocalidad = event["nombre"];
        this.localidadNacSelected = event["id"];
        break;
    }
  }




  onDatosGeograficosByNacimiento(event: string){
    this.objNacimiento = {
      pais: event["pais"],
      estado: event["estado"],
      municipio: event["municipio"],
      localidad: event["localidad"]
    }
  }

  onDatosCurp(event: string){
    this.objCurp = {
      apellido1: event["apellido1"],
      apellido2: event["apellido2"],
      nombre: event["nombre"],
      sexo: event["sexo"],
      estado: event["estado"],
      fecha: event["fecha"],
      nacionalidad: event["nacionalidadId"]
    }

  }


  onDatosGeograficosByDomicilio(event: string){

    this.objDomicilio = {
      pais: event["pais"],
      estado: event["estado"],
      municipio: event["municipio"],
      localidad: event["localidad"],
      cp: event["cp"],
      colonia: event["colonia"],
      calle: event["calle"],
      numExt: event["numExt"],
      numInt: event["numInt"],
      entre1: event["entre1"],
      entre2: event["entre2"]
    }

  }

  asignarByNacimiento() {
    this.nacimiento = {
      pais: this.dataUsuario['paisNac'].toString().trim(),
      estado: this.dataUsuario['estadoNac'].toString().trim(),
      municipio: this.dataUsuario['municipioNac'].toString().trim(),
      localidad: this.dataUsuario['localidadNac'].toString().trim()
    }
  }


  asignarByDomicilio() {
    this.domicilio = {
      pais: this.dataUsuario['paisDom'].toString().trim(),
      estado: this.dataUsuario['estadoDom'].toString().trim(),
      municipio: this.dataUsuario['municipioDom'].toString().trim(),
      localidad: this.dataUsuario['localidadDom'].toString().trim(),
      cp: this.dataUsuario['codigoPostalDom'].toString().trim(),
      colonia: this.dataUsuario['coloniaDom'].toString().trim(),
      calle: this.dataUsuario['calle'].toString().trim(), 
      numExt: this.dataUsuario['numExt'].toString().trim(),
      numInt: this.dataUsuario['numInt'].toString().trim(),
      entre1: this.dataUsuario['entre1'].toString(),
      entre2: this.dataUsuario['entre2'].toString()
    }
  }

  
  


}
