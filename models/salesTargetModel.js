const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,      // Product name
  quantity: Number   // Sale quantity for the month
});

const monthSchema = new mongoose.Schema({
  monthName: String,
  employeeId:Number,
  lastUpdate:{
    type: Date,
    default: Date.now,
  },
  products: [productSchema] // Array of products and their sale quantities
});

const yearSchema = new mongoose.Schema({
    year:{
        type:Number,
        required:[true, "Please Select A Product"],
    },
    storeId:{
        type:String,
        required:[true, "Please Select A Store"],
    },
    months: [monthSchema] // Array of months for the year
});

const Sales = mongoose.model('Sales', yearSchema);

module.exports = Sales;





