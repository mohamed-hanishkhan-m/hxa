const Customer = require("../models/Customer"); // adjust the path to your Customer model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token }); // front-end will use this token
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { loginCustomer };