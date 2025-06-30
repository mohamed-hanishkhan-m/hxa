const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, default: 0 },
  category: { type: String },
  variants: { type: String }, // ✅ NEW FIELD (can be comma-separated string or array)
  images: [String], // URLs
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  visible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
