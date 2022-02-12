
import express from 'express'
import { CommonRoutesConfig } from './common/common.route.config';
import { CompanyRoutes } from './company/company.routes';
import { EmployeeRoutes } from './employee/employee.routes';


const routes: Array<CommonRoutesConfig> = [];

class MainRoutes {
    app: express.Application = express();
    constructor() {
        routes.push(new CompanyRoutes(this.app));
        routes.push(new EmployeeRoutes(this.app));
    }
}

export default new MainRoutes();


