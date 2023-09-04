const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        employeeId: mongoose.Schema.Types.UUID,
        userName:{
            type:String,
            required:[true,"User Id is a mandatory field"],
            maxLength:[20,"User Id cannot Be More Than 20 Characters"],
            minLength:[4,"User Id cannot Be Less Than 4 Characters"]
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
        role:{
            type:String,
            default:"user"
        },
        resetPasswordToken:{
            token:{
                type:String,
            },
            resetPasswordExpire:{
                type:Date,
            }
        }
        
    }
)

module.exports = mongoose.model("User", userSchema);