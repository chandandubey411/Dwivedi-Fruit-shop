import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import upload from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.post('/', protectAdmin, upload.single('qrImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // Configure Cloudinary properly mapped from ENV
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    // Cloudinary pipeline via streamifier
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: 'diwedifruitshop/settings' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
});

router.post('/products', protectAdmin, upload.array('images', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    // Configure Cloudinary explicitly
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    // Cloudinary streamifier helper
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: 'diwedifruitshop/products' },
          (error, result) => {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Parallel upload of all selected images
    const uploadPromises = req.files.map(file => streamUpload(file.buffer));
    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      imageUrls // Returns the final array of URLs directly back to frontend
    });
  } catch (error) {
    console.error('Products image upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
});

export default router;
