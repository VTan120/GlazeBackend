const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productBarcode: { 
        type: String, 
    },
    productName: String,
    category: String,
    productOffer:String,
    quantity: Number,
    costPrice:Number,
    sellingPrice:Number
  });
  
 // Store schema with an array of products
const storeSchema = new mongoose.Schema({
    storeId: String,
    storeLocation: String,
    products: [productSchema],
});

const POSStore = mongoose.model('POSStore', storeSchema);

module.exports = POSStore;