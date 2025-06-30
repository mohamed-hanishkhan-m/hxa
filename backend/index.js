require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');
const customerRoutes = require('./routes/customer');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', orderRoutes);
app.use('/api/customers', customerRoutes);

app.get('/api/ping', (req, res) => res.json({ message: 'Backend is alive 🚀' }));

// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
