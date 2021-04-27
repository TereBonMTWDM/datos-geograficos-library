import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';


@Component({
  selector: 'dgtit-apartado-enlaces-menu',
  templateUrl: './apartado-enlaces-menu.component.html',
  styleUrls: ['./apartado-enlaces-menu.component.scss']
})
export class ApartadoEnlacesMenuComponent implements OnInit {

  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger
  @Input() menuItems: any
  @Input() siteMapLink: any

  isSearchPanelShowing: boolean = false
  searchPanel: HTMLElement

  constructor() { 
  }

  ngOnInit() {
   
  }

  toogleSearchPanel(): void {
    !this.isSearchPanelShowing ? this.showSearchPanel() : this.hideSearchPanel()
  }

  showSearchPanel(): void {
    this.searchPanel = <HTMLElement>document.getElementById('dgtitsearch')
    this.searchPanel.classList.add('show-panel')
    this.isSearchPanelShowing = true
    this.searchPanel.style.display='block'
    setTimeout(()=>{
      this.searchPanel.classList.remove('show-panel')
    }, 500)
    Array.from(document.getElementsByName('search'))[0].focus()
  }

  hideSearchPanel(): void {
    this.searchPanel.classList.add('hide-panel')
    this.isSearchPanelShowing = false
    setTimeout(()=>{
      this.searchPanel.style.display='none'
      this.searchPanel.classList.remove('hide-panel')
    }, 500)
  }

}
