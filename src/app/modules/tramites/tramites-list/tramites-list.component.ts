import { Component, OnInit } from '@angular/core';
import { Tramite } from 'src/app/models/catalogo/tramite.model';
import { TramitesService } from 'src/app/services/tramites.service';

@Component({
  selector: 'app-tramites-list',
  templateUrl: './tramites-list.component.html',
  styles: []
})
export class TramitesListComponent implements OnInit {
  tramites: Tramite[] = [];

  constructor(
    private tramitesSvc: TramitesService
  ) { }

  ngOnInit() {
    this.getTramites();
  }

  getTramites() {
    this.tramitesSvc.get().subscribe( 
      (result: Tramite) => {        
        this.tramites = result.data;
        console.log(this.tramites);
    });
  }

}
