
import mongoose, { Model } from 'mongoose'
import companyModel from './company.model';
import { CreateCompanyDto as CreateCompanyDto } from './interface/company.dto';
import { PatchCompanyDto } from './interface/company.patch'
const ObjectId = require('mongoose').Types.ObjectId;

class companyDao {
        Company = mongoose.model("Company", companyModel.companySchema);

        async addCompany(details: CreateCompanyDto): Promise<string> {
                const company = new this.Company(details);
                const companyId = await company.save();
                return companyId._id.toString();
        }

        async getCompanyById(id: string) {
                return await this.Company.findOne({ _id: id }).exec(); //returns real promise
        }
        async isCompanyExists(email: string) {
                return this.Company.findOne({ email: email }).select("companyName");
        }
        async getCompanies() {
                return await this.Company.find().exec();
        }
        /** in typescript if we make any class partial then and changed not all values then
         * changed value will only reflated not all values.
         */
        /**if true, return the modified document rather than the original. */
        async updateCompanyById(Id: string,
                companyDetails: CreateCompanyDto | PatchCompanyDto) {
                return await this.Company.findOneAndUpdate(
                        { _id: Id },
                        { $set: companyDetails },
                        { new: true }
                ).exec();
        }
        

        async deleteCompanyById(Id: string) {
                return await this.Company.findByIdAndDelete({ _id: Id }).exec();
        }
        async validMongooseId(id: string) {
                if (ObjectId.isValid(id)) {
                        if ((String)(new ObjectId(id)) === id)
                                return true;
                        return false;
                }
                return false;
        }

        async findCompanyKey(Id: string) {
                return await this.Company.findOne({ _id: Id }).exec();
        }
}

export default new companyDao();