const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    storeName:{
        type:String,
        required:[true, "Please Select A StoreName"],
        unique:[true, "Store Name Should Be Unique"]
    },

    location:{
        type:String,
        required:[true, "Please Select A Location"]
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

    productsInventory:[

    ]

});

module.exports = mongoose.model("Store", storeSchema)