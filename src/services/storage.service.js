const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const logger = require('../config/logger');

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
 * Upload image to Cloud Storage (Cloudinary) or fallback to local static URL
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Public image URL
 */
async function uploadPestImage(file) {
  if (!file) return null;

  try {
    // If Cloudinary keys are present, upload directly to cloud
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      logger.info(`Uploading image to Cloudinary: ${file.filename}`);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'pest-detection-scans',
        resource_type: 'image',
      });

      // Optionally clean up local temp file after cloud upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      logger.info(`Cloudinary upload successful: ${result.secure_url}`);
      return result.secure_url;
    }
  } catch (error) {
    logger.warn(`Cloudinary upload failed: ${error.message}. Falling back to local static URL.`);
  }

  // Fallback to local static URL path
  return `/uploads/${file.filename}`;
}

module.exports = {
  uploadPestImage,
};
