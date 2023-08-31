const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({

});

module.exports = mongoose.model("rawMaterial", ingredientSchema);