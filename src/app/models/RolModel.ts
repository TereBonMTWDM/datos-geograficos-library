export class RolModel {
  public rolID?: number;
  public descripcion: string;
  public estatus?: boolean;
  public creador?: string;
  public creacion?: string;
  public modificador?: string;
  public modificacion?: string;
  public rolMenu?: RolMenuModel[];
  public rolMenuN?: RolMenuModel[];
  //public rolMenu: RolMenuModel;
  public rolUsuario?: RolUsuarioModel[]
  public UsuarioID?: number;   

  public action?: string;
  
  data?: RolModel[];
  statusCode?: number;
  statusText?: string;
}

export class RolMenuModel {
  public menuID: number;
  public descripcion?: string;
  public texto?: string;
  public inicio: string;
  public final: string;
  public rolID?: number;
  public UsuarioID?: number;

  data?: RolMenuModel[];
  statusCode?: number;
  statusText?: string;
}


export class RolUsuarioModel {
  public usuarioID?: number;
  public email?: string;
  public inicio: string;
  public final: string;
  public rolID?: number;
  public descripcion?: string;

  data?: RolUsuarioModel[];
  statusCode?: number;
  statusText?: string;
}