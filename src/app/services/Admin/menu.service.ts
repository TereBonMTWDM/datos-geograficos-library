import { Injectable } from '@angular/core';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { NotifierService } from 'angular-notifier';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { NgForage } from 'ngforage';

const headersPaginado = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': '10'
    })
};
const headersById = {
    headers: new HttpHeaders({
        'x-menu_id': ''
    })
};

const headersPaginadoAll = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': ''
    })
};

const headersPaginadoAllRutas = {
    headers: new HttpHeaders({
        'x-menu_ruta': '1'
    })
};

const headersBorrado = {
    headers: new HttpHeaders({
        'x-menu_id': '',
        'x-usuario_id': ''
    })
};

const headersAdd = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

const headersMenuActual = {
    headers: new HttpHeaders({
        'x-menu_href': '/'
    })
};
const headersUpd = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-menu_id': ''
    })
};

const headersFilter = {
    headers: new HttpHeaders({
        'x-pagina_num': '1',
        'x-pagina_tamanio': '20',
        'x-menu_texto': '',
        'x-menu_descripcion': ''
    })
};

const headersAsigRolMenu = {
    headers: new HttpHeaders({
        'x-rolmenu_rol_id': '',
        'x-rolmenu_menu_id': '',
        'x-rolmenu_inicio': '',
        'x-rolmenu_final': '',
        'x-rolmenu_usuario_id': ''
    })
};

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    urlAPI: string;
    dataUser: string;
    constructor(private http: HttpClient,
        private store: NgForage,) {
        // Dependiendo del tipo de deploy apuntar a productivo o a calidad
        this.urlAPI = environment.API_URL;
    }


    Get(tam: number, pag: number){
        const headers = {
          headers: new HttpHeaders({
            'x-pagina_num': pag.toString(),
            'x-pagina_tamanio': tam.toString()
          })
        };
        return this.http.get(this.urlAPI + "Menu", headers);
    }

    getMenus() {
        return this.http.get(this.urlAPI + "Menu", headersPaginado);
    }

    getMenusByPSize(pageSize) {
         headersPaginado.headers =
             headersPaginado.headers.set('x-pagina_tamanio', "" + pageSize + "");
        return this.http.get(this.urlAPI + "Menu", headersPaginado);
    }

    getMenusActual(url) {
        headersMenuActual.headers =
            headersMenuActual.headers.set('x-menu_href', url );
        return this.http.get(this.urlAPI + "Menu", headersMenuActual);
    }

    getMenuRutas() {
        const header = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-menu_ruta': '1'
            })
        };
        return this.http.get(this.urlAPI + "Menu", header);
    }

    addMenu(formMenu) {
        return this.http.post(this.urlAPI + "Menu", formMenu, headersAdd);
    }

    updateMenu(formMenu, idMenu) {
        headersUpd.headers =
            headersUpd.headers.set('x-menu_id', "" + idMenu + "");
        return this.http.put(this.urlAPI + "Menu", formMenu, headersUpd);
    }

    getMenusAll() {
        return this.http.get(this.urlAPI + "Menu", headersPaginadoAll);
    }

    getMenusRutas(){
        return this.http.get(this.urlAPI + "Menu", headersPaginadoAllRutas);
    }
    getDataById(idMenu) {
        headersById.headers =
            headersById.headers.set('x-menu_id', "" + idMenu + "");
        return this.http.get(this.urlAPI + "Menu", headersById);
    }
    getAllRoles() {
        return this.http.get(this.urlAPI + "Rol", headersPaginadoAll);
    }

    getMenuFilter(texto, descripcion) {
        headersFilter.headers =
            headersFilter.headers.set('x-menu_texto', "" + texto + "");
        headersFilter.headers =
            headersFilter.headers.set('x-menu_descripcion', "" + descripcion + "");
        return this.http.get(this.urlAPI + "Menu", headersFilter);
    }

    getMenupage(numeroPag) {
        headersPaginado.headers =
            headersPaginado.headers.set('x-pagina_num', "" + numeroPag + "");
        return this.http.get(this.urlAPI + "Menu", headersPaginado);
    }

    deleteMenu(idMenu,dataUser) {
        headersBorrado.headers =
            headersBorrado.headers.set('x-menu_id', "" + idMenu + "");
        headersBorrado.headers =
            headersBorrado.headers.set('x-usuario_id', "" +dataUser['idx'] + "");
        return this.http.delete(this.urlAPI + "Menu", headersBorrado);
    }


    deleteRolMenu(rolMenu, idMenu,dataUser) {
        headersAsigRolMenu.headers =
            headersAsigRolMenu.headers.set('x-rolmenu_rol_id', "" + parseInt(rolMenu.rolID) + "");
        headersAsigRolMenu.headers =
            headersAsigRolMenu.headers.set('x-rolmenu_menu_id', "" + parseInt(idMenu) + "");
        headersAsigRolMenu.headers =
            headersAsigRolMenu.headers.set('x-rolmenu_inicio', "" + rolMenu.inicio + "");
        headersAsigRolMenu.headers =
            headersAsigRolMenu.headers.set('x-rolmenu_final', "" + rolMenu.final + "");
        headersAsigRolMenu.headers =
            headersAsigRolMenu.headers.set('x-rolmenu_usuario_id', "" + parseInt(dataUser['idx']) + "");
        return this.http.delete(this.urlAPI + "RolMenu", headersAsigRolMenu);
    }

    postRolMenu(data) {
        return this.http.post(this.urlAPI + "RolMenu", data, headersAdd);
    }

}