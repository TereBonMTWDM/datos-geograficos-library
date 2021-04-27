import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class inCitas implements CanActivate {
    valor;
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree|any> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.usuarioLogeadoOnCitas) {
            this.authService.getPerfilCompleto().subscribe(resp=>{
                if (resp['data'][0]['perfilCompletado'] == 1){
                    this.router.navigate(['tramites']);
                }else{
                    this.router.navigate(['registroUsuario']);
                }
            });
            return false;
        }
        return true;
    }

}
