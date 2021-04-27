import { Component, OnInit, ViewChild} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ApartadoEnlacesPerfilesComponent } from "../apartado-enlaces-perfiles/apartado-enlaces-perfiles.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(private authService: AuthService, private notifier: NotifierService, private router: Router) { }
  @ViewChild(HeaderComponent, { static: true }) menuHeader: HeaderComponent;
  @ViewChild(ApartadoEnlacesPerfilesComponent, { static: true }) menuheader: ApartadoEnlacesPerfilesComponent;

  ngOnInit() {

  }

  signIn() {
    this.authService.authLogin();
  }
  signInWindows() {
    this.authService.authLoginMicrosoft();
  }
  registrate(){
    this.router.navigate(['/registroUsuario']);
  }

 

}
