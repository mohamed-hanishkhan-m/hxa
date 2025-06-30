const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer'); // Create this model
const router = express.Router();
const { loginCustomer } = require("../controllers/customerController");



router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if customer already exists
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
    });

    await newCustomer.save();

    const token = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, customer: { name, email } });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", loginCustomer);


module.exports = router;