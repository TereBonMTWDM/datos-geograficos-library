import { Component, OnInit, Output } from '@angular/core';
import { HeaderService } from './../../services/base/header.service';
import { AuthService } from '../../services/auth/auth.service'

@Component({
  selector: 'dgtit-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerParams: any
  headerParamsdata: any
  constructor(private headerService: HeaderService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.watchStorage().subscribe((data: string) => {
      if (data != null) {
        this.getHeaderConfiguration(data)
      } else {
        this.getHeaderConfigurationNoLog()
      }
    })
  }

  async getHeaderConfiguration(data): Promise<any> {
    this.headerParamsdata = await this.headerService.getHeaderParams(data).toPromise()
    this.headerParams = await this.headerService.getHeaderParamsSocial().toPromise()
    this.headerParams.navBar.menu = this.headerParamsdata.data
  }

  async getHeaderConfigurationNoLog(): Promise<any> {
    this.headerParamsdata = await this.headerService.getHeaderParamsNoLogeado().toPromise()
    // console.log(this.headerParamsdata)
    this.headerParams = await this.headerService.getHeaderParamsSocial().toPromise()
    this.headerParams.navBar.menu = this.headerParamsdata.data
  }
}
