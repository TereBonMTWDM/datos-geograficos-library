export class MenuModel { 
    public menuID: number;
    public padre: number;
    public texto: string;
    public descripcion: string;
  
    data?: MenuModel[];
    statusCode?: number;
    statusText?: string;
}