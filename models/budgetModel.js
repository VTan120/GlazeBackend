const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
  monthName: String, // January, February, etc.
  monthlyBudget: Number // Array of products and their sale quantities
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

const Budget = mongoose.model('Budget', yearSchema);

module.exports = Budget;





