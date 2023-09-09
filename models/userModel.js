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
            public_id:{
                type:String,
            },
            url:{
                type:String,
            }
        },
        aadharCard:{
            type:String,
            required:[true,"Adhar Numver Is A Required Fiels"],
            unique:[true,"Adhar Number Is Already Used"],
            maxLength:[12,"User Id cannot Be More Than 20 Characters"],
            minLength:[12,"User Id cannot Be Less Than 4 Characters"]
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
            superviser_id:{
                type: mongoose.Schema.ObjectId
            },
            superviser_name:{
                type: String
            }
        },

        store: {
            store_id:{
                type: Number
            },
            store_location:{
                type: String
            }
        },
        // resetPasswordToken:{
        //     token:{
        //         type:String,
        //     },
        //     resetPasswordExpire:{
        //         type:Date,
        //     }
        // }
        
    }
)

module.exports = mongoose.model("User", userSchema);