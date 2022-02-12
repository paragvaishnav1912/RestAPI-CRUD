import { CommonRoutesConfig } from "../common/common.route.config";
import express from 'express'
import coverage from '../common/coverage';
import companyController from "./company.controller";

export class CompanyRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app);
    }
    configureRoutes(): express.Application {
        this.app.route('/company')
            .get(companyController.listCompanies)
            .post(companyController.createCompany);

        this.app.route(`/company/:id`)
            .get(
                coverage.validateKey, /**checks for invalid key value */
                companyController.getCompaniesById)
            .delete(
                coverage.validateKey,
                companyController.deleteById);

        this.app.put('/company/:id',
            coverage.validateKey,
            companyController.updateById);

        this.app.patch('/company/:id', [
            coverage.validateKey,
            companyController.updateById
        ])

        return this.app;
    }
}