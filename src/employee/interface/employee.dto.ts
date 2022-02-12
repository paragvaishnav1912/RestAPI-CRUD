export interface CreateEmployeeDto{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyId:string,
    post:string,
    isVerified:boolean,
}
