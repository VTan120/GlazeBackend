const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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

  date: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: Number,
    enum: [0, 1, 2, 3], // Example status values
    default: 0,
  },

  note: {
    type: String, 
  },

  invoiceImage: {
    type: String, 
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
