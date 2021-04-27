import { Component, OnInit } from '@angular/core';
import { HeaderService } from './../../services/base/header.service';
import { AuthService } from '../../services/auth/auth.service'


@Component({
  selector: 'app-site-map',
  templateUrl: './site-map.component.html',
  styleUrls: ['./site-map.component.scss']
})
export class SiteMapComponent implements OnInit {

  constructor(private headerService: HeaderService, private authService: AuthService) { }
  data:any;
  siteMapData: any
  ngOnInit() {
    this.authService.watchStorage().subscribe((data: string) => {
      if (data != null) {
        this.getDataSiteMap(data)
      } else {
        this.getDataSiteMapNoLog()
      }
    })
  }

  async getDataSiteMap(data): Promise<any> {
    this.siteMapData = await this.headerService.getHeaderParams(data).toPromise()
    this.data = this.siteMapData.data
    console.log(this.siteMapData.data)

  }

  async getDataSiteMapNoLog(): Promise<any> {
    this.siteMapData = await this.headerService.getHeaderParamsNoLogeado().toPromise()
    this.data = this.siteMapData.data
    console.log(this.siteMapData);
    
  }

}
