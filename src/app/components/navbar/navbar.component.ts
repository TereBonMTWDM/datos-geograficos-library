import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dgtit-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() navBarParams : any
  constructor() { }

  ngOnInit() {
  }

}
