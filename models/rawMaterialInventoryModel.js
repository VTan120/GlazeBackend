const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    orderId: Number,
    date: {
        type:Date
    },
    pastDue:{
        type:Boolean,
        default:false
    },
    weight:Number,
});

const rawMaterialSchema = new mongoose.Schema({
    name: String,
    batches: [batchSchema] // Array of products and their sale quantities
});

const rawMaterialInventorySchema = new mongoose.Schema({
    storeId:{
        type:String,
        required:[true,"Store Id is Required For Inventory"],
        unique:[true,"Duplicate Inventory Id"]
    },
    rawMaterials:[rawMaterialSchema]
})

const RawMaterialInventory = mongoose.model('RawMaterialInventory', rawMaterialInventorySchema);

module.exports = RawMaterialInventory;