const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchId: Number,
    date: {
        type:Date
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
    latestBatch:{
        type:Number,
        default:0
    },
    rawMaterials:[rawMaterialSchema]
});

const RawMaterialInventory = mongoose.model('RawMaterialInventory', rawMaterialInventorySchema);

module.exports = RawMaterialInventory;