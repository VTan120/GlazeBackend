const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    product:[
        {
            name:{
                type: String,
                required:[true,"Please Select A Product"]
            },

            weight:{
                type: Number,
                // required:[true,"Please Enter The Required Weight In Kg"]
            },

            costPerKg:{
                type: Number,
                // required:[true,"Please Enter The Cost Per Kelogram"]
            },
        }
    ],
    
    status:{
        type:String
    },

    employee:{
        employeeId: {type:Number},
        employeeName:{
            type:String
        }
    },

    approval:{
        employeeId: {type:Number},
        employeeName:{
            type:String
        }
    },

    invoice:{ //Invoice will be an image or pdf from supplyer
        publicId:{
            type:String,
        },
        url:{
            type:String,
        }
    },

    store: {
        storeName:{
            type: String
        },
        storeLocation:{
            type: String
        }
    },
},

{ timestamps: true }

);

module.exports = mongoose.model("Order", orderSchema);