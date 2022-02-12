
export interface CRUD {
    list: () => Promise<any>;
    create: (resource: any) => Promise<any>;
    updateById: (id: string, resource: any) => Promise<any>;
    readById: (id: string) => Promise<any>;
    deleteById: (id: string) => Promise<any>;
    patchById: (id: string, resource: any) => Promise<any>;
    getUser:(email:string) => Promise<any>
}