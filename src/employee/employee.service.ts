import { CreateEmployeeDto } from "./interface/employee.dto";
import { CRUD } from "../common/common.crud";
import employeeDao from "./employee.dao";

class EmployeeService implements CRUD{
    async getUser(email:string){
        return await employeeDao.getEmployeeByEmail(email);
    }

    async create(information: CreateEmployeeDto) {
        return await employeeDao.addEmployee(information);
    }

    async list() {
        return employeeDao.getEmployee();
    }

    async readById(id: string) {
        return employeeDao.getEmployeeById(id);
    }

    async updateById(id: string, information: CreateEmployeeDto) :Promise<any> {
        return employeeDao.updateEmployeeById(id, information);
    }

    async patchById(id: string, resource: any) : Promise<any> {
        return employeeDao.updateEmployeeById(id, resource);
    }
    async deleteById(id: string) {
        return employeeDao.deleteEmployee(id);
    }
}

export default new EmployeeService();