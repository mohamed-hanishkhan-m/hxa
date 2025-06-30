const express = require('express');
const router = express.Router();
const { login } = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const Order = require('../models/Order.js'); // ✅ make sure this is correct

router.post('/login', login);

// 🔐 Protected route
router.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: `Welcome, Admin ${req.user.email}` });
});

// ✅ Admin Overview Route
router.get('/dashboard/status', authenticate, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pending = await Order.countDocuments({ status: /pending/i });
    const delivered = await Order.countDocuments({ status: /delivered/i });
    const cancelled = await Order.countDocuments({ status: /cancelled/i });

    res.json({
      totalOrders,
      pending,
      delivered,
      cancelled,
    });
  } catch (err) {
    console.error('Dashboard data error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});


module.exports = router;
