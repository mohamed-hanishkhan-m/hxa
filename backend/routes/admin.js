const express = require('express');
const router = express.Router();
const { login } = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');

router.post('/login', login);

// 🔐 Protected route
router.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: `Welcome, Admin ${req.user.email}` });
});

module.exports = router;