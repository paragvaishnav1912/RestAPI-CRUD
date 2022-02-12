import mongoose from 'mongoose';
import validation from 'mongoose-unique-validator';
class employeeModel {
    employeeSchema = new mongoose.Schema({
        email: {
            trim: true,
            type: String,
            required: [true, "Email Id Required"],
            unique: true,
            validate: {
                validator: (v: any) => {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Entered Email Id is not Valid!'
            }
        },
        password: {
            type: String,
            required: [true, "Password Required"],
            trim: true,
            validate: {
                validator: (v: string) => {
                    return /^[0-9A-Za-z]\w{4,8}$/;
                },
                message: 'Entered password is not Valid!'
            }
        },
        firstName: {
            type: String,
            required: [true, "firstName Required"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "lastName Required"],
            trim: true
        },
        companyId: {
            type: String,
            required: [true, "EmployeeId Required"],
            trim: true
        },
        post: {
            type: String,
            enum: ["Manager", "TeamLeader", "Developer"],
            default: "Developer"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        code: String
    }).plugin(validation, { message: '{PATH} must be unique' });
}

export default new employeeModel();