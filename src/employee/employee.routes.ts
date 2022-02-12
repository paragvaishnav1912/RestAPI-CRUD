import { CommonRoutesConfig } from "../common/common.route.config";
import express from 'express'
import employeeController from "../employee/employee.controller";
import authCtrl from "../auth/auth.controller";
import coverage from "../common/coverage";
import authMiddleware from "../auth/auth.middleware";
export class EmployeeRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app);
    }

    configureRoutes(): express.Application {
        this.app.route('/employee')
            .get(authMiddleware.jwtTokenValidate,
                employeeController.listEmployee)
            .post(
                coverage.validCompanyKey,
                employeeController.createEmployee);

        this.app.route('/logout')
                .post(authCtrl.logoutUser);

        this.app.route('/confirm/:id')
            .get(authCtrl.verifyingUser)


        this.app.route('/login')
            .post(
                coverage.userVerified,
                authCtrl.validateUser)

        this.app.route(`/employee/:id`)
            .get(
                [coverage.validateKey,
                employeeController.getEmployeeById])
            .delete(
                coverage.validateKey,
                employeeController.deleteById);

        this.app.put('/employee/:id', [
            coverage.validateKey,
            employeeController.updateById
        ]);

        this.app.patch('/employee/:id', [
            coverage.validateKey,
            employeeController.updateById
        ])

        return this.app;
    }
}

