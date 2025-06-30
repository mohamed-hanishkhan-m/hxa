const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  status: {
    type: String,
    enum: ['pending', 'delivered','cancelled'],
    default: 'pending',
  },
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Prevent OverwriteModelError during hot reload
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
