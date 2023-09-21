const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
    englishName:{
        type:String,
        required:[true, "Please Select A Product"],
        unique:[true, "Raw Material Alteady Added"]
    },
    hindiName:{
        type:String,
        unique:[true, "Raw Material Alteady Added"]
    },
    expiryTime:{
        type:Number
    },
    storageNote:{
        type:String,
    },
})

module.exports = mongoose.model("RawMaterial", rawMaterialSchema);