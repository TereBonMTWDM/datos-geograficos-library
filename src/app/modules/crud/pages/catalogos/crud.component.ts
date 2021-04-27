import { LoaderService } from './../../../../services/base/loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { ResourseService } from 'src/app/services/catalogos/resourceService/resourse.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  resourceList: any
  resourceName: string = "Catálogo"

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourseService<Resource>,
    private loader: LoaderService
  ) {
    this.route.params.subscribe(
      async (params) => {
        this.loader.showLoader()
        this.resourceName = params.catName
        this.resourceList = await this.resourceService.makeRequest(
          (this.resourceService.list(params.catName)),
          false
        )
        this.loader.closeLoader()
      }
    )
  }

  async ngOnInit() {
  }

  onHandleResource = async (event: any) => {
    switch (event) {
      case 'update':
        this.loader.showLoader()
        this.resourceList = await this.resourceService.makeRequest(
          (this.resourceService.list(this.resourceName)),
          false
        )
        this.loader.closeLoader()
        break
    }
  }

}
