import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario, Token } from '../modules/shared/interfaces/jwt.interface';
import { AuthService } from '../services/auth/auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JwtService implements HttpInterceptor, OnDestroy {

    private tkn: Token;
    private refrescandoToken = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private general: AuthService) {
        this.general.tkn.subscribe(tkn => this.tkn = tkn);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.agregarToken(req, (!!this.tkn ? this.tkn : null));

        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return this.manejar401Error(req, next);
            } else {
                return throwError(error);
            }
        }));
    }

    private manejar401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.refrescandoToken) {
            this.refrescandoToken = true;
            this.refreshTokenSubject.next(null);

            return this.general.obtenerToken().pipe(
                switchMap((nuevoToken: Token) => {
                    this.refrescandoToken = false;
                    this.refreshTokenSubject.next(nuevoToken);
                    return next.handle(this.agregarToken(request, nuevoToken));
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.agregarToken(request, token));
                })
            );
        }
    }

    private agregarToken(request: HttpRequest<any>, token: Token) {
        if (token != null && request.url !== `${environment.T.urlApiAuth}oauth2/token`) {
            this.general.emitirValor(token);
            return request.clone({
                setHeaders: { Authorization: `${token.token_type} ${token.access_token}` }
            });
        } else {
            return request.clone();
        }
    }
    ngOnDestroy() {
        this.general.tkn.unsubscribe();
    }
}