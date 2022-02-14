import { Request, Response, NextFunction } from "express";
import companyDao from "../company/company.dao";

import employeeDao from "../employee/employee.dao";
import generateMessage from '../common/common.message';
class message {
     COMPANY = "Company";
     EMPLOYEE = "Employee"
     SERVER_MSG = "Server has started at port number ";
     DB_MSG = "Database Connected ";
     SUCCESS = "Created Successfully ";
     OK = "Success"
     UNSUCCESS = " Already Exists "
     FAILED = "Failure"
     MISS_FILED = "This Fields Are Essential "
     UPDATED = " Details Are Updated ";
     LOGIN_FIRST = "You need to Login First"
     DELETED = "Details Deleted ";
     WRONG_PASS = "Wrong Password";
     NOT_EXISTS = "There is no such ";
     NO_EMAIL = "There is no such Email Id";
     AUTH_FAIL = "Authentication Failed"
     AUTH_SUCCESS = "Authentication Success"
     EMPTY = "There is no ";
     KEY_EXISTS = " already exists ";
     ID_ERROR = "Wrong Id written "


     async userVerified(req: Request, res: Response, next: NextFunction) {
          const status = await employeeDao.getEmployeeByEmail(req.body.email);
          if (status.length > 0) {
               if (Object.values(status[0].toObject())[2]) {
                    next();
               }
               else {
                    res
                         .status(httpStatus.AUTH_FAIL)
                         .send(generateMessage.validation("Your Email has not been verified", "Failed", httpStatus.AUTH_FAIL));
               }
          }
          else {
               res
                    .status(httpStatus.AUTH_FAIL)
                    .send(generateMessage.validation("Invalid Email Id", "Failed", httpStatus.AUTH_FAIL));
          }
     }
     async validateKey(req: Request, res: Response, next: NextFunction) {
          if (await companyDao.validMongooseId(req.params.id)) {
               next();
          }
          else {
               res
                    .status(httpStatus.ERROR)
                    .send(generateMessage.validation("Wrong Id Written", "Failed", 400));
          }
     }
     async validCompanyKey(req: Request, res: Response, next: NextFunction) {
          if (await companyDao.validMongooseId(req.body.companyId)) {

               if (await companyDao.findCompanyKey(req.body.companyId)) {
                    next();
               }
               else {
                    res
                         .status(httpStatus.NOT_FOUND)
                         .send(generateMessage.validation("There is no such Company", "Failed", 404));
               }
          }
          else {
               res
                    .status(httpStatus.ERROR)
                    .send(generateMessage.validation("Wrong Id Written", "Failed", 400));
          }
     }
     async passwordBlank(req: Request, res: Response, next: NextFunction) {
          if (req.body.password) {
               next();
          } else {
               res
                    .status(httpStatus.ERROR)
                    .send(generateMessage.validation("password missing", "Failed", 400));
          }
     }
}

export enum httpStatus {
     OK = 200,
     CREATE = 201,
     NOT_FOUND = 404,
     AUTH_FAIL = 401,
     ERROR = 400,
}

export default new message();