const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    product:{
        type:String,
        required:[true, "Please Select A Product"]
    },
    weight:{
        type: Number,
        required:[true,"Please Enter The Required Weight In Kg"]
    },
    costPerKg:{
        type: Number,
        required:[true,"Please Enter The Cost Per Kelogram"]
    },
    status:{
        type:String
    },
    employee:{
        employeeId: mongoose.Schema.ObjectId,
        employeeName:{
            type:String
        }
    },
    invoice:{ 
        publicId:{
            type:String,
        },
        url:{
            type:String,
        }
    },
    store: {
        storeId:{
            type: mongoose.Types.ObjectId
        },
        storeLocation:{
            type: String
        }
    },
});

module.exports = mongoose.model("Order", orderSchema);