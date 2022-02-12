import generateMessage from '../common/common.message';
import employeeService from "../employee/employee.service";
import bcrypt from 'bcrypt'
import coverage from '../common/coverage';
import dotenv from 'dotenv';
dotenv.config();
import { httpStatus } from '../common/coverage';
import Jwt from "jsonwebtoken";
import employeeDao from "../employee/employee.dao"
import { Request, Response } from 'express';
class authCtrl {


    async logoutUser(req: Request, res: Response) {
        req.headers['authorization'] = undefined;
        res.status(httpStatus.OK)
            .send(generateMessage.validation("logout  " + req.headers['authorization'], coverage.FAILED, httpStatus.ERROR));

    }

    async verifyingUser(req: Request, res: Response) {
        // console.log('userin')
        const code = req.params.id;
        const flag = await employeeDao.getEmployeeByToken(code);
        // console.log(flag);
        if (flag.length != 0) {
            const flagCheck = await employeeDao.updateEmployeeStatus(true, code)
            if (flagCheck.acknowledged) {
                //console.log("in----");
                res.status(httpStatus.OK)
                    .send(generateMessage.validation("you can now login", coverage.OK, httpStatus.OK));
                    await employeeDao.deleteOne(code);
            }
            else {
                //console.log("in else ------------");
                res.status(httpStatus.NOT_FOUND)
                    .send(generateMessage.validation(coverage.NOT_EXISTS + coverage.EMPLOYEE, coverage.FAILED, httpStatus.NOT_FOUND));
            }
        }
        else {
            //console.log("in else ------------");
            res.status(httpStatus.NOT_FOUND)
                .send(generateMessage.validation('Your Email has not been verified. Please click on resend', coverage.FAILED, httpStatus.NOT_FOUND));
        }
    }
    async validateUser(req: Request, res: Response) {
        const user = await employeeService.getUser(req.body.email);
        if (user.length < 1) {
            res.status(httpStatus.NOT_FOUND)
                .send(generateMessage.validation(coverage.NOT_EXISTS + coverage.EMPLOYEE, coverage.FAILED, httpStatus.NOT_FOUND));
        }
        else {
            try {
                const password = Object.values(user[0].toObject())[1];
                const email = Object.values(user[0].toObject())[0]
                bcrypt.compare(req.body.password, password, (err, result) => {
                    if (err) {
                        return res.status(httpStatus.AUTH_FAIL)
                            .send(generateMessage.validation(coverage.NOT_EXISTS, coverage.FAILED, httpStatus.AUTH_FAIL));
                    }
                    if (result) {
                        const token = Jwt.sign({
                            email: email,
                            password: password
                        },
                            `${process.env.JWT_KEY}`,
                            {
                                expiresIn: "1hr"
                            }
                        );

                        return res.status(httpStatus.OK)
                            .send(generateMessage.validation(coverage.AUTH_SUCCESS, token, httpStatus.OK));
                    }
                    return res.status(httpStatus.AUTH_FAIL)
                        .send(generateMessage.validation(coverage.AUTH_FAIL, coverage.FAILED, httpStatus.AUTH_FAIL));
                })
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}
export default new authCtrl();