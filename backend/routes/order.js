const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// ✅ Route: Get all orders
router.get('/dashboard/orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;