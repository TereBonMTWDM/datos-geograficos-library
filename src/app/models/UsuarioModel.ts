import { RolUsuarioModel } from './RolModel';

export class UsuarioModel {
    public usuarioID?: number;
    public email?: string;
    public estatus?: boolean;

    public apellido1?: string;
    public apellido2?: string;
    public nombre?: string;
    public curp?: string;
    public sexo?: string;
    public rfc?: string;
    public celular?: string;

    public creador?: string;

    public rolUsuario?: RolUsuarioModel[];



    data?: UsuarioModel[];
    statusCode?: number;
    statusText?: string;
}