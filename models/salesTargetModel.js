const mongoose = require("mongoose");

const salesTargetSchema = new mongoose.Schema({
    year:{
        type:Number,
        required:[true, "Please Select A Product"],
    },
    storeId:{
        type:String,
        required:[true, "Please Select A Store"],
    },
    months:[
        {
            month:String,
            targets:[{
                product:String,
                target:Number
            }]
        }
    ],
})

module.exports = mongoose.model("SalesTarget", salesTargetSchema);