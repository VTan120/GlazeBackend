const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId:Number,
  employeeId: {
    type: Number,
    required: true,
  },

  approvedBy: {
    type:Number
  },

  storeId: {
    type: String,
    required: true,
  },

  consumptionDate:{
    month:{
      type:String,
    },
    year:{
      type:Number,
    }
  },

  products: [
    {
      name: {
        type: String, 
      },
      quantity: {
        type: Number,
      },
      materials: [{
        name: String,
        weight: Number,
      }],
    },
  ],

  materialPrices:[{
    materialName:String,
    weight:Number,
    price:Number
  }],

  requestDate: {
    type: Date,
    default: Date.now,
  },

  approvalDate:{
    type: Date,
  },

  status: {
    type: Number,
    enum: [-1, 0, 1, 2, 3, 4], // Example status values
    default: 0,
  },

  note: {
    type: String, 
  },

  invoiceImage: {
    type: String, 
  },

  quoteImage: {
    type: String, 
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
