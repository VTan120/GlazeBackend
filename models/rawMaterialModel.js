const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Select A Product"]
    },
})

module.exports = mongoose.model("RawMaterial", rawMaterialSchema);