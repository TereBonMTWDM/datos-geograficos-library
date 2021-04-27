import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RolesGuard implements CanActivate {
    acceso;
    constructor(private authService: AuthService, private router: Router) {
        
    }

     canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.authService.usuarioLogeado) {
            this.router.navigate(['login']);
            return false;
        }else{
            return this.authService.accesoUrl(state.url).then(data =>{
                if (data['data'] && data['data'].length > 0) {
                    (data['data'][0]['acceso'] == 0) ? this.acceso = false : this.acceso = true;
                }
            return this.acceso;
         }).catch(er=>{
             return false;
         })
        }   
    }
}