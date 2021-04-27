import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { NotifierService } from 'angular-notifier';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { RolMenuModel, RolModel, RolUsuarioModel } from 'src/app/models/RolModel';




const headersPaginado = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': '10'
    })
};
const headersPaginadoAll = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': ''
    })
};

/*
const headersBorrado = {
    headers: new HttpHeaders({
        'x-menu_id': '',
        'x-usuario_id': ''
    })
};
*/

const headersAdd = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

const headersFilter = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': '20',
        'x-rol_descripcion': ''
    })
};

@Injectable({
    providedIn: 'root'
})
export class RolService {
    urlAPI: string;
    dataUser: string;
    constructor(private http: HttpClient) {
        // Dependiendo del tipo de deploy apuntar a productivo o a calidad
        this.urlAPI = environment.API_URL;
    }


    addRol(formRol: RolModel) {
        return this.http.post(this.urlAPI + "Rol", formRol);
    }




    updateRol(formRol: RolModel) {
        var idRol = formRol.rolID;
        const header = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-rol_id': idRol.toString()
            })
        };
        return this.http.put(this.urlAPI + "Rol", formRol, header);
    }




    getRolById(idRol: number) {
        const headerId = {
            headers: new HttpHeaders({
                'x-rol_id': idRol.toString()
            })
        };
        return this.http.get(this.urlAPI + "Rol", headerId);
    }


    Get(tam: number, pag: number) {
        const headers = {
            headers: new HttpHeaders({
                'x-pagina_num': pag.toString(),
                'x-pagina_tamanio': tam.toString()
            })
        };
        return this.http.get(this.urlAPI + "Rol", headers);
    }

    getRols() {
        return this.http.get(this.urlAPI + "Rol", headersPaginado);
    }

    getRolsBSize(pageSize) {
        headersPaginado.headers =
            headersPaginado.headers.set('x-pagina_tamanio', "" + pageSize + "");
        return this.http.get(this.urlAPI + "Rol", headersPaginado);
    }

    
    getRolesAll() {
        return this.http.get(this.urlAPI + "Rol", headersPaginadoAll);
    }
    getAllRoles() {
        return this.http.get(this.urlAPI + "Rol", headersPaginadoAll);
    }

    getRolFilter(descripcion) {
        headersFilter.headers =
            headersFilter.headers.set('x-rol_descripcion', "" + descripcion + "");
        return this.http.get(this.urlAPI + "Rol", headersFilter);
    }

    getRolpage(numeroPag) {
        headersPaginado.headers =
            headersPaginado.headers.set('x-pagina_num', "" + numeroPag + "");
        return this.http.get(this.urlAPI + "Rol", headersPaginado);
    }

    deleteRol(rolID, dataUser) {
        const header = {
            headers: new HttpHeaders({
                'x-rol_id': parseInt(rolID).toString(),
                'x-usuario_id': parseInt(dataUser['idx']).toString()
            })
        };
        return this.http.delete(this.urlAPI + "Rol", header);
    }


    /* #region  ROL MENU */

    postRolMenu(rolMenu: RolMenuModel) {

        return this.http.post(this.urlAPI + 'RolMenu', rolMenu);
    }


    deleteRolMenu(rolMenu: RolMenuModel) {
        const header = {
            headers: new HttpHeaders({
                'x-rolmenu_rol_id': rolMenu.rolID.toString(),
                'x-rolmenu_menu_id': rolMenu.menuID.toString(),
                'x-rolmenu_inicio': rolMenu.inicio.toString(),
                'x-rolmenu_final': rolMenu.final.toString(),
                'x-rolmenu_usuario_id': rolMenu.UsuarioID.toString()
            })
        };

        return this.http.delete(this.urlAPI + 'RolMenu', header);
    }
    /* #endregion */



    deleteRolUsuario(rolUsuario: RolUsuarioModel, dataUser) {
        const header = {
            headers: new HttpHeaders({
                'x-rolusuario_rol_id': rolUsuario.rolID.toString(),
                'x-rolusuario_usuario_id': rolUsuario.usuarioID.toString(),
                'x-rolusuario_inicio': rolUsuario.inicio.toString(),
                'x-rolusuario_final': rolUsuario.final.toString(),
                'x-rolusuario_modificador': ''+dataUser['idx']+''
            })
        };

        return this.http.delete(this.urlAPI + 'RolUsuario', header);
    }

}