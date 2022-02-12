import companyDao from "./company.dao"
import { CreateCompanyDto as CreateCompanyDto } from "./interface/company.dto"
import { CRUD } from "../common/common.crud";


class CompanyService implements CRUD{
    getUser!: (email: string) => Promise<any>;
  
    async create(information: CreateCompanyDto):Promise<string>{
        return await companyDao.addCompany(information)
    }
    async list() {
        return companyDao.getCompanies();
    }
    async readById(id: string) {
        return companyDao.getCompanyById(id);
    }
    async deleteById(id: string) {
        return companyDao.deleteCompanyById(id);
    }
    async updateById(id:string,information: CreateCompanyDto) :Promise<any> {
        return companyDao.updateCompanyById(id,information);
    }
    async patchById(id: string, resource: any) :Promise<any> {
        return companyDao.updateCompanyById(id, resource);
    }
}

export default new CompanyService();