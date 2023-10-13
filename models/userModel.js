const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        employeeId: {
            type:Number,
            unique:[true,"employeeId Is Already Used"],
        },
        employeeName:{
            type:String,
            required:[true,"User Id is a mandatory field"],
        },
        email:{
            type:String,
            required:[true,"Email Id is a mandatory field"],
            unique:[true,"Email Is Already Used"],
            validate:[validator.isEmail,"Enter A Valid Email"]
        },
        password:{
            type:String,
            required:[true,"Email Id is a mandatory field"],
        },
        avatar:{ 
            publicId:{
                type:String,
            },
            url:{
                type:String,
            }
        },

        phoneNumber:{
            type:String,
            required:[true,"Phone Number Is A Required Fiels"],
            unique:[true,"Phone Number Is Already Used"],
        },

        role:{
            type:String,
            default:"user"
        },

        birthDate: {
            type:Date,
        },

        joiningDate: {
            type:Date,
        },

        terminationDate:{
            type:Date,
        },

        superviser: {
            superviserId:{
                type: mongoose.Schema.ObjectId
            },
            superviser_name:{
                type: String
            }
        },

        storeId:{
                type: String
        }
        
    }
)

module.exports = mongoose.model("User", userSchema);