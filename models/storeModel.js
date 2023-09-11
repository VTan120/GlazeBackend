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
        storeManagerId: mongoose.Schema.ObjectId,
        storeManagereName:{
            type:String
        }
    },

});

module.exports = mongoose.model("Store", storeSchema)