const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Select A Product Name"],
        unique:[true, "Product Alteady Exists"]
    },
    recipe:[
        {
            name:{
                type:String
            },
            percentage:{
                type:Number
            }
        }
//name and percentage
    ],
    chef:{
        type:Number
    }
    // {
    //     employeeId:{
    //         type:Number
    //     },
    //     name:{
    //         type:String
    //     }
    // }
});

module.exports = mongoose.model("Product", productSchema);