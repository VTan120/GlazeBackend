const mongoose = require("mongoose")



const CompletedManufacturingOrderSchema = new mongoose.Schema({

    storeId:{
        type:String,
        required:true,
    },

    adminId: {
        type: Number,
        required: true,
      },

    approvedBy:{
        type:Number
      },
      
    approvalDate:{
        type: Date,
      },  
      
    employeeName:String,

    approvarName:String, 

    product:{
        type:String,
        required:[true,"Please select a product to manufacture"],
    },

    

    // createdby:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"User",
    // },
    
    date:{
        type:Date,
        default:Date.now,

    },

    productionMonth:{

        month:{
            type:String,
            require:[true,"Enter a Month"]
        },

        year:{
            type:Number,
            require:[true,"Enter a year"]
        }
    },

    // packaging:[{
    //         weight:{
    //             type:Number,
    //             required:[true,"Please enter packets w "]
    //         },

    //         packets:{
    //             type:Number,
    //             required:true,
    //         }
    // }      
    // ]
    
    weight:{
        type:Number,        
    },

    
    packages:[
        {
            packageType:{
                type:String,
            },

            packageQuantity:{
                type:Number,
            }
        }
    ],

    status:{
        type:Number,
        
    }

},{timestamps:true})

module.exports = mongoose.model("CompletedManufacturOrder",CompletedManufacturingOrderSchema);