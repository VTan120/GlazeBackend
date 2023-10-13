const mongoose = require("mongoose");

const rawMaterialBatches = new mongoose.Schema({
    batchId:{
        type:String,
        required:[true, "No Batch Id "]
    },

    expiryDate: {
        type:Date,
        required:[true, "Enter Expiry Date"]
    },

    materialName:{
        type:String,
        required:[true, "Enter Material Name"]
    },

    invoiceImage: {
        type: String, 
        required:[true, "Invoice Needed"]
      },
})

const storeSchema = new mongoose.Schema({
    storeId:{
        type:String,
        required:[true, "Please Select A StoreName"],
        unique:[true, "Store Name Should Be Unique"]
    },

    city:{
        type:String,
        required:[true, "Please Select A Location"]
    },

    active:{
        type:Boolean,
        default:true
    },

    storeManager:{
        employeeId: {type:Number},
        storeManagereName:{
            type:String
        }
    },

    rawMaterialInventory:[
//baches
    ],

});

module.exports = mongoose.model("Store", storeSchema)