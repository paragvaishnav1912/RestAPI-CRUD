import mongoose from 'mongoose';;
import employeeModel from './employee.model';
import { CreateEmployeeDto } from './interface/employee.dto';
import dotenv from 'dotenv';
dotenv.config();
import mailForConfirmation from './nodemailer.config'
import jwt from 'jsonwebtoken'
import { PatchEmployeeDto } from './interface/employee.patch';

class employeeDao {
    Employee = mongoose.model("Employee", employeeModel.employeeSchema);

    async addEmployee(details: CreateEmployeeDto) {
        const token = jwt.sign(
            {
                email: details.email,
            },
            `${process.env.EMAIL_KEY}`,
        )
        const employee = new this.Employee(
            {
                code: token,
                ...
                details
            });
        const companyId = await employee.save();
        mailForConfirmation.sendConfirmationEmail(details.firstName + details.lastName, details.email, token);
        return companyId._id.toString();
    }
    async getEmployeeById(id: string) {
        return this.Employee.findOne({ _id: id }).exec();
    }

    async getEmployeeByEmail(emailId: string) {
        return await this.Employee.find({ email: emailId }, { email: 1, password: 1, _id: 0, isVerified: 1 }).exec();

    }
    async updateEmployeeStatus(flag:boolean,emailId:string){
        return await this.Employee.updateOne({code:emailId}, {isVerified:flag},{code:""});
    }
    async getEmployeeByToken(token:string){
        return await this.Employee.find({code:token}).exec();
    }

    async getEmployee() {
        return await this.Employee.find().exec();
    }
    async updateEmployeeById(Id: string,
        employeeDetails: CreateEmployeeDto | PatchEmployeeDto
    ) {
        return await this.Employee.findByIdAndUpdate(
            { _id: Id },
            { $set: employeeDetails },
            { new: true }
        ).exec();
    }

    async deleteEmployee(Id: string) {
        return await this.Employee.deleteOne({ _id: Id }).exec();
    }

    async deleteOne(code:string){
        return this.Employee.updateMany(
            {code:code },
            { $unset: { code: "" } }
         )
    }
}

export default new employeeDao();