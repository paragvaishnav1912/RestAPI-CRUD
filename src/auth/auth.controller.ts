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

        try {

            res.clearCookie("jwt");
            const token = req.headers?.cookie?.substring(4);
            const decoded = Jwt.verify(token + "", `${process.env.JWT_KEY}`);
            res.status(httpStatus.OK)
                .send(generateMessage.validation("your successfully logged out", coverage.AUTH_FAIL, httpStatus.OK));
        }
        catch (e) {
            return res.status(401).json({
                message: 'something went wrong!!'
            });
        }
    }

    async verifyingUser(req: Request, res: Response) {
        const code = req.params.id;
        const flag = await employeeDao.getEmployeeByToken(code);
        if (flag.length != 0) {
            const flagCheck = await employeeDao.updateEmployeeStatus(true, code)
            if (flagCheck.acknowledged) {
                res.status(httpStatus.OK)
                    .send(generateMessage.validation("you can now login", coverage.OK, httpStatus.OK));
                await employeeDao.deleteOne(code);
            }
            else {
                res.status(httpStatus.NOT_FOUND)
                    .send(generateMessage.validation(coverage.NOT_EXISTS + coverage.EMPLOYEE, coverage.FAILED, httpStatus.NOT_FOUND));
            }
        }
        else {
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
                            `${process.env.JWT_KEY}`
                        );
                        res.cookie('jwt', token, {
                            httpOnly: true,
                            maxAge: 5 * 60 * 1000
                        })
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