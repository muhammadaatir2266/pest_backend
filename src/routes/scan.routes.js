const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scan.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { scanLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/', scanLimiter, optionalAuth, upload.single('image'), scanController.createScan);
router.get('/', authenticate, scanController.getScans);
router.get('/:id', optionalAuth, scanController.getScanById);
router.delete('/:id', authenticate, scanController.deleteScan);

module.exports = router;
