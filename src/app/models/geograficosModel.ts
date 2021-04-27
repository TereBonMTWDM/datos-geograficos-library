export class PaisModel {
    public paisID: string;
    public pais: string;
    public oficial: string;

    data?: PaisModel[];
}

export class EstadoModel {
    public entidadID: number;
    public entidad: string;
    public abreviatura: string;    

    data?: EstadoModel[];
}

export class MunicipioModel {
    public municipioID: string;
    public municipio: string;
    public id: string;
    public nombre: string;

    data?: MunicipioModel[];
}

export class LocalidadModel {
    //public localidadID: string;
    public localidad: string;

    data?: LocalidadModel[];
}

export class ColoniaModel {
    public asentamientoID: string;
    public colonia: string;
    // public asentamiento: string;
    // public tipoAsentamiento: string;

    data?: ColoniaModel[];
}


export class CodigoPostalModel {
    public cp: string;

    data?: CodigoPostalModel[];
}

export class CalleModel {
    // public vialidadID: string;
    public vialidad: string;

    data?: CalleModel[];
}



// //===========by Nacimiento==============//
// export class NacimientoModel {
//     public pais: string;
//     public estado : string;
// }