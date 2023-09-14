const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({

    employeId:{
        type:Number
    },

    orderNumber:{
        type:String,
        required:[true, "Please enter the ordernumber"],
        unique:[true,"orderNumber already exist"]
    },

    trackingNumber:{
        type:String,
        require:[true,"Please enter the trackingnumber"],
        unique:[true,"trackingNumber already exist"]
    },

});

module.exports = mongoose.model("Tracking", trackingSchema);