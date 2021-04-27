import { LoaderService } from './../../../../services/base/loader/loader.service';
import { Catalogo } from 'src/app/models/catalogo/catalogo.model';
import { CatalogoService } from './../../../../services/catalogos/catalogo/catalogo.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { ResourseService } from './../../../../services/catalogos/resourceService/resourse.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  @Input() resourceList: any[] = []
  @Input() resourceName: string = ''
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @Output() resourcEmitter = new EventEmitter<string>()

  public displayedColumns: string[] = []
  public dataSource: any = []
  public title: string = ''
  public model: any
  public catalog: Catalogo = new Catalogo()
  public formData: any = {}
  public selectedTab = 0
  public resourceActionLabel = 'Agregar'

  constructor(
    private rscService: ResourseService<Resource>,
    private notifier: NotifierService,
    private cat: CatalogoService,
  ) {
  }

  async ngOnInit() {
    this.model = (this.cat[this.resourceName])()
    this.formData = await this.model['buildForm']()
    this.getTitleFromResourceName(this.resourceName)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.resourceList = changes.resourceList.currentValue
    this.dataSource = new MatTableDataSource<Resource>(changes.resourceList.currentValue)

    this.displayedColumns = typeof (this.resourceList) !== 'undefined' ? (
      (typeof (this.model.displayedColumns) !== 'undefined' && this.model.displayedColumns.length > 0) ?
        this.model.displayedColumns.concat('actions') :
        this.resourceList.length > 0 ?
          Object.keys(this.resourceList[0]).concat('actions')
          : null) : []
    this.dataSource.paginator = this.paginator
  }

  applyFilter = (filterValue: string) => this.dataSource.filter = filterValue.trim().toLowerCase()

  getTitleFromResourceName = (str) => this.title = this.model['title']

  private onEditResource = async (resource: Resource) => {
    this.selectedTab = 1
    this.formData = (await (this.cat[this.resourceName])(resource).buildForm(['edit', 'close']))
    this.resourceActionLabel = 'Editar'
  }

  private onDeleteResource = async (resource: Resource) => (
    await this.rscService.makeRequest(this.rscService.delete(this.resourceName, (this.cat[this.resourceName](resource)).Id)),
    this.onSuccessResponse('update')
  )

  onSuccessResponse = async (action: string) => (
    this.selectedTab = 0,
    this.resourcEmitter.emit(action),
    this.formData = await this.model['buildForm'](),
    this.resourceActionLabel = "Agregar"
  )

  onFormDataReceived = async (event: any) => {
    switch (event.action) {
      case 'add': // crear recurso
        await this.rscService.makeRequest(this.rscService.create(this.resourceName, event.data)),
          this.onSuccessResponse('update')
        break
      case 'edit': // editar recurso
        await this.rscService.makeRequest(this.rscService.update(this.resourceName.toLocaleLowerCase(), event.data, event.id)),
          this.onSuccessResponse('update')
        break
      case 'close': // cierra el formulario
        this.formData = await this.model['buildForm']()
        this.onSuccessResponse('')
        break
    }
  }
}
