export class User {
    constructor(
        readonly id: number,
        public nombres: string,
        public primerApellido: string,
        public idDependencia: number,
        public idRol: number,
        public cuenta: string,
        public activo?: boolean,
        public segundoApellido?: string,
        public fechaCreacion?: string,
        public fSechaModificacion?: string,
    ) { }
}