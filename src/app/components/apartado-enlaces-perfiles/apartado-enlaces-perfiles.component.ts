import { Component, OnInit, SimpleChanges,Input } from '@angular/core';
import { AuthService} from '../../services/auth/auth.service'
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'dgtit-apartado-enlaces-perfiles',
  templateUrl: './apartado-enlaces-perfiles.component.html',
  styleUrls: ['./apartado-enlaces-perfiles.component.sass']
})
export class ApartadoEnlacesPerfilesComponent implements OnInit {
  dataUser;
  usuario: BehaviorSubject<any>;
  @Input() socialItems:any
  constructor(private authService: AuthService, private router: Router) { }

    async ngOnInit() {
      this.authService.watchStorage().subscribe((data: string) => {
        this.dataUser = (data);
      })
  }

  cerrarSession(){
    this.authService.signOut();
  }

  navPerfil() {
    this.router.navigate(['/registroUsuario']);
  }



}
