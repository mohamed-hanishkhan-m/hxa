const Admin = require('../models/Admin'); // ✅ Import fixed

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("🛠 Login attempt:", email, password);

  try {
    const admin = await Admin.findOne({ email });
    console.log("🧾 Found admin:", admin);

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', adminId: admin._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
