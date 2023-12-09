const mongoose = require("mongoose");

const posBillSchema = new mongoose.Schema({
    storeId:{
        type:String,
    },

    billNo:{
        type:Number,
        unique:[true, "Bill No Already Exist"],
        required:[true, "Bill No Not Generated"]
    },

    customerName:{
        type:String,
    },

    customerPhoneNumber:{
        type:String,
    },

    products:[{
        productId:String,
        productName:String,
        quantity:Number,
        price:Number,
    }],

    payment:[{
        method:String,
        price:Number,
    }],

    billTime:{
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("POSBill", posBillSchema)