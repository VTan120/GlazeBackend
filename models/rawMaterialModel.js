const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Select A Product"],
        unique:[true, "Raw Material Alteady Added"]
    },
    expiryTime:{
        type:Number
    },
})

module.exports = mongoose.model("RawMaterial", rawMaterialSchema);