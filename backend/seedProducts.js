// seedProducts.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product'); // adjust path as needed

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany(); // Optional: clear previous products

    const sampleProducts = [
      {
        name: 'Oversized Tee – Midnight Black',
        brand: 'HxA',
        description: 'Relaxed fit black tee with minimal HxA embroidery',
        price: 1499,
        stock: 20,
        category: 'T-Shirts',
        images: ['https://source.unsplash.com/200x200/?tshirt,black']
      },
      {
        name: 'Cargo Pants – Olive Green',
        brand: 'HxA',
        description: 'Streetwear utility pants with extra pockets',
        price: 2499,
        stock: 15,
        category: 'Bottoms',
        images: ['https://source.unsplash.com/200x200/?cargo-pants,green']
      },
      {
        name: 'Graphic Hoodie – Eclipse',
        brand: 'HxA',
        description: 'Cozy black hoodie with custom back graphic',
        price: 2999,
        stock: 10,
        category: 'Hoodies',
        images: ['https://source.unsplash.com/200x200/?hoodie,black,graphic']
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products inserted!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  });
