import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosGeograficosController {

    constructor() { }

    filtrar_acentos(input) {
        var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";

        for (var i = 0; i < acentos.length; i++) {
        input = input.replace(acentos.charAt(i), original.charAt(i)).toLowerCase();
        };

        return input;
    }

  
}