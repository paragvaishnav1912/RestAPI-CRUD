import mongoose from 'mongoose';
import validation from 'mongoose-unique-validator';

class companyModel {
    companySchema = new mongoose.Schema({
        companyName: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "CompanyName Required"]
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "Email Id Required"],
            validate: {
                validator: (v: any) => {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Entered Email Id is not Valid!'
            }
        },
        phoneNumber: {
            type: String,
            trim: true,
            required: [true, "PhoneNumber Required"],
            validate: {
                validator: function (v: any) {
                    return /^\d{10}$/.test(v);
                },
                message: '{VALUE} is not a valid 10 digit number!'
            }
        },
        addressOne: {
            type: String,
            trim: true,
            required: [true, "Address Required"]
        },
        addressTwo: {
            type: String,
            trim: true
        },
        pinCode: {
            type: Number,
            trim: true,
            required: [true, "PinCode Required"],
            validate: {
                validator: (v: any) => {
                    return /^\d{6}$/.test(v);
                },
                message: 'Entered pinCode is not valid!'
            }
        },
        city: {
            type: String,
            trim: true,
            required: [true, "City Required"]
        },
        country: {
            type: String,
            trim: true,
            required: [true, "Country Required"]
        },
        status: {
            type: String,
            enum: ["Active", "InActive"],
            default: "Active"
        }
    }).plugin(validation, { message: '{PATH} must be unique' });
}

export default new companyModel();  