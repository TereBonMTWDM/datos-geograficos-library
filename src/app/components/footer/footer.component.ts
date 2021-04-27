import { Component, OnInit } from '@angular/core';
import { FooterServiceService } from './../../services/base/footer-service.service';


@Component({
  selector: 'dgtit-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {

  footerData: any = []

  constructor(public footerService: FooterServiceService) { }

  async ngOnInit() {
    await this.getFotterData()
  }

  async getFotterData(){
    this.footerData = await this.footerService.getFooterConfiguration()
  }

}
