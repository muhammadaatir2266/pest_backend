const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

// Configure S3 Client if environment variables are provided
let s3Client = null;
if (process.env.S3_BUCKET_NAME && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
  try {
    s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || 'https://t3.storageapi.dev',
      region: process.env.S3_REGION || 'auto',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
    logger.info(`S3 Bucket Cloud Storage configured successfully for bucket: ${process.env.S3_BUCKET_NAME}`);
  } catch (err) {
    logger.error(`Failed to initialize S3 Client: ${err.message}`);
  }
}

// Configure Cloudinary if environment variables are provided
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logger.info('Cloudinary Cloud Storage configured successfully.');
}

/**
 * Upload image to S3 Object Storage, Cloudinary, or fallback to local static URL
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Public image URL
 */
async function uploadPestImage(file) {
  if (!file) return null;

  // 1. Try S3 Compatible Storage (Railway StorageAPI / Tigris / AWS S3)
  if (s3Client) {
    try {
      logger.info(`Uploading image to S3 Bucket (${process.env.S3_BUCKET_NAME}): ${file.filename}`);
      const fileStream = fs.createReadStream(file.path);
      const ext = path.extname(file.originalname || file.filename) || '.jpg';
      const fileKey = `scans/${Date.now()}-${file.filename}${ext}`;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: fileStream,
        ContentType: file.mimetype || 'image/jpeg',
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // Clean up local temp file after cloud upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      const publicBaseUrl = process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT || 'https://t3.storageapi.dev'}/${process.env.S3_BUCKET_NAME}`;
      const imageUrl = `${publicBaseUrl.replace(/\/$/, '')}/${fileKey}`;
      logger.info(`S3 upload successful: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      logger.warn(`S3 upload failed: ${error.message}. Attempting fallback storage options.`);
    }
  }

  // 2. Try Cloudinary if S3 not present or failed
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      logger.info(`Uploading image to Cloudinary: ${file.filename}`);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'pest-detection-scans',
        resource_type: 'image',
      });

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      logger.info(`Cloudinary upload successful: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      logger.warn(`Cloudinary upload failed: ${error.message}. Falling back to local static URL.`);
    }
  }

  // 3. Fallback to local static URL path
  return `/uploads/${file.filename}`;
}

module.exports = {
  uploadPestImage,
};
