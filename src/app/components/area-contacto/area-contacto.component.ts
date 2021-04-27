import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'dgtit-area-contacto',
  templateUrl: './area-contacto.component.html',
  styleUrls: ['./area-contacto.component.scss']
})
export class AreaContactoComponent implements OnInit {
  @Input() headerParams: any 

  constructor() {}

  ngOnInit() {
  }

}
