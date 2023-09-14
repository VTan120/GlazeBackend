const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    recipe:[
//name and percentage
    ],
    chef:{
        employeeId:{

        },
        name:{
            type:String
        }
    }
});

module.exports = mongoose.model("Product", productSchema);