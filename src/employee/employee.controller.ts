import { Request, Response } from "express";
import generateMessage from '../common/common.message';
import employeeService from "./employee.service";
import bcrypt from 'bcrypt'
import logger from '../common/logger';
import coverage from '../common/coverage';
import dotenv from 'dotenv';
dotenv.config();
import { httpStatus } from '../common/coverage';
class employeeCtrl {

    async listEmployee(req: Request, res: Response) {
        const list = await employeeService.list();
        list.length == 0 ? res.status(httpStatus.NOT_FOUND)
            .send(generateMessage.validation(coverage.EMPTY + coverage.EMPLOYEE, coverage.FAILED, httpStatus.NOT_FOUND))
            : res.status(httpStatus.OK).send(list);
    }

    async getEmployeeById(req: Request, res: Response) {
        const list = await employeeService.readById(req.params.id);
        list == null ? res.status(httpStatus.NOT_FOUND)
            .send(generateMessage.validation(coverage.NOT_EXISTS + coverage.EMPLOYEE, coverage.FAILED, httpStatus.NOT_FOUND)) :
            res.status(httpStatus.OK)
                .send(generateMessage.validation(list, coverage.OK, httpStatus.OK));
    }

    async createEmployee(req: Request, res: Response) {
        if (req.body.password != undefined) {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    console.log(err);
                }
                else {
                    req.body.password = hash;
                    try {
                        const companyId = await employeeService.create(req.body);
                        res.status(httpStatus.CREATE).send({
                            "Id": companyId,
                            "message": coverage.SUCCESS,
                            "status": coverage.OK,
                            "statusCode": httpStatus.CREATE
                        });
                    }
                    catch (e: any) {
                        let errObj = e.errors;
                        let errorMsg = "";
                        for (let i in errObj) { errorMsg += errObj[i].message + ", "; }
                        errorMsg = errorMsg.substring(0, errorMsg.length - 2);
                        logger.logger.error('from CREATE ', e);
                        res.status(httpStatus.ERROR)
                            .send(generateMessage.validation(errorMsg, coverage.FAILED, httpStatus.ERROR))
                    }
                }
            })
        }
        else {
            res.status(httpStatus.ERROR)
                .send(generateMessage.validation("Password Required", coverage.FAILED, httpStatus.ERROR))
        }
    }

    async updateById(req: Request, res: Response) {
        const list = await employeeService.readById(req.params.id);
        if (list === null) { res.status(httpStatus.NOT_FOUND).send({ message: coverage.NOT_EXISTS }) }
        else {
            try {
                await employeeService.updateById(req.params.id, req.body);
                res
                    .status(httpStatus.OK)
                    .send(generateMessage.validation(coverage.UPDATED + coverage.EMPLOYEE, coverage.OK, httpStatus.OK));
            }
            catch (e: any) {
                logger.logger.error('from UPDATE', e);
                let errorMsg = "";
                if (e.code && e.code === 11000) {
                    let key = Object.keys(e.keyValue)[0];
                    errorMsg = key + coverage.KEY_EXISTS;
                }
                res
                    .status(httpStatus.ERROR)
                    .send(generateMessage.validation(errorMsg, coverage.FAILED, httpStatus.ERROR));
                logger.logger.error(e);
            }
        }
    }

    async deleteById(req: Request, res: Response) {

        const list = await employeeService.readById(req.params.id);
        list === null ? res.status(httpStatus.NOT_FOUND).send({ message: coverage.NOT_EXISTS + coverage.EMPLOYEE })
            : await employeeService.deleteById(req.params.id),
            res
                .status(httpStatus.OK)
                .send(generateMessage.validation(coverage.EMPLOYEE + coverage.DELETED, coverage.SUCCESS, httpStatus.OK))

    }
}
export default new employeeCtrl();