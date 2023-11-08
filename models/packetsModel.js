const mongoose = require("mongoose")

const packetSchema= new mongoose.Schema({

    productName:{
        type:String,
        required:true
    },

    packetWeight:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("Packet",packetSchema);