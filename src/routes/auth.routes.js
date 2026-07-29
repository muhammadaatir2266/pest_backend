const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/signup', authLimiter, validate(authController.signupSchema), authController.signup);
router.post('/login', authLimiter, validate(authController.loginSchema), authController.login);
router.post('/guest-login', authLimiter, authController.guestLogin);
router.post('/verify-otp', authLimiter, validate(authController.otpSchema), authController.verifyOtp);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/logout', authController.logout);

module.exports = router;
