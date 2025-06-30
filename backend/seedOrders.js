require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order.js');

// Sample orders
const sampleOrders = [
  {
    customerName: 'Ayaan Malik',
    items: [
      { productId: 'p1', name: 'HxA Hoodie', quantity: 1, price: 1299 },
      { productId: 'p2', name: 'HxA Joggers', quantity: 2, price: 999 },
    ],
    totalAmount: 3297,
    status: 'Delivered',
  },
  {
    customerName: 'Sara Iqbal',
    items: [
      { productId: 'p3', name: 'HxA T-Shirt', quantity: 3, price: 499 },
    ],
    totalAmount: 1497,
    status: 'Pending',
  },
  {
    customerName: 'Karthik Rao',
    items: [
      { productId: 'p4', name: 'HxA Cargo Pants', quantity: 1, price: 1599 },
    ],
    totalAmount: 1599,
    status: 'Cancelled',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await Order.deleteMany({});
    console.log('🧹 Cleared old orders');

    await Order.insertMany(sampleOrders);
    console.log('✅ Sample orders inserted');

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeder error:', err);
    mongoose.disconnect();
  }
};

seed();
