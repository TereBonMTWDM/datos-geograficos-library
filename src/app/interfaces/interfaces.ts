// Interface para interactuar con el API y enviar el usuario
export interface t_usuario {
usr_idusuario?: number;
  usr_nombre?: string;
  usr_apellidoPaterno?: string;
  usr_apellidoMaterno?: string;
usr_puesto?: string; 
usr_telefono?: string;
usr_extension?: string;
usr_correoe : string;
opcion?: number;
usr_estatus?: number;
usr_vip?: boolean;
usr_iddependencia?: number;
usr_rol?: string;
}
  
export interface t_usuarioxroles {
    urol_id?: number;
    urol_idusuario?: number;
    urol_idrol?: number; 
}

export interface t_rol {
  urol_id?: number;
  urol_idrol?: number;
}


export interface t_usuarios {
  usr_idusuario?: number;
  usr_nombre?: string;
  usr_estatus?: number;
  usr_vip?:number;
  usr_nombrerol?: string;
  nombredependencia?: string;
}

export interface i_lmenu {
  texto?: string;
  descripcion?: string;
  roles?: string;
}


export interface i_catalogoArchivo {
  extension?: string;
  descripcion?: string;
}

export interface i_anexoPerfil {
  texto?: string;
  formato?:string;
  descripcion?: string;
}
export interface i_lrol {
  descripcion?: string;
}
export interface t_User {
  usr_idusuario?: number;
  usr_nombre?: string;
  usr_puesto?: string;
  usr_telefono?: number;
  usr_extension?: number;
  usr_correoe?: string;
  usr_estatus?: number;
  usr_vip?: number;
  usr_iddependencia?: number;
  nombredependencia?: string;
  usr_rol?: number;
  usr_nombrerol?: string;
}
