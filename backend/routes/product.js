const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadImage');
const bucket = require('../config/firebase');
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const authenticate = require('../middleware/authMiddleware');

router.post(
    '/upload',
    authenticate,
    upload.single('image'),
    async (req, res) => {
      try {
        const file = req.file;
        const fileName = Date.now() + '-' + file.originalname;
  
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
  
        blobStream.on('error', (err) => {
          return res.status(500).json({ message: 'Upload failed', error: err.message });
        });
  
        blobStream.on('finish', async () => {
          try {
            // Make the uploaded file public
            await blob.makePublic();
  
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            return res.status(200).json({ message: 'Uploaded', url: publicUrl });
          } catch (err) {
            return res.status(500).json({ message: 'Upload succeeded but failed to make public', error: err.message });
          }
        });
  
        // Pipe the buffer into the storage stream
        blobStream.end(file.buffer);
      } catch (err) {
        return res.status(500).json({ message: 'Upload error', error: err.message });
      }
    }
  );
  
// Protected routes
router.post('/', authenticate, createProduct);
router.get('/', authenticate, getProducts);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);
module.exports = router;