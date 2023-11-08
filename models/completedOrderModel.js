const mongoose = require('mongoose');

const completedOrderSchema = new mongoose.Schema({
  orderId:Number,
  employeeId: {
    type: Number,
    required: true,
  },

  approvedBy: {
    type:Number
  },

  employeeName:String,

  approvarName:String,

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
    default: 4,
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

const CompleteOrder = mongoose.model('CompleteOrder', completedOrderSchema);

module.exports = CompleteOrder;
