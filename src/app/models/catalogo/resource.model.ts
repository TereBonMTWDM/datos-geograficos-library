export abstract class Resource {
    constructor(
        public Id: any = 0,
        public title: string = '',
        public status?: number,
        public statusField?: string,
        public displayedColumns?: string[]
    ) { }
    mapToSelectKeys = (modelArray: any, idField:string, keyField: string) => modelArray.map(el => el = { key: el[keyField], value: el[idField] })
}