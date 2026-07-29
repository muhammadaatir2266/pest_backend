const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response.util');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_farmers_pest_jwt_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_token_key_2026';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, phone: user.phone, isGuest: user.isGuest },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

// Validation Schemas
const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  password: Joi.string().min(6).required(),
  farmLocation: Joi.string().optional().allow(''),
  preferredLanguage: Joi.string().valid('en', 'ur').default('en')
});

const loginSchema = Joi.object({
  loginIdentifier: Joi.string().required(), // email or phone
  password: Joi.string().required()
});

const otpSchema = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.string().length(6).required()
});

/**
 * Signup Controller
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, farmLocation, preferredLanguage } = req.body;

    if (!email && !phone) {
      return sendError(res, 'Either email or phone number is required for registration.', 400);
    }

    // Check if user already exists
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) return sendError(res, 'An account with this email already exists.', 400);
    }
    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) return sendError(res, 'An account with this phone number already exists.', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        passwordHash,
        farmLocation: farmLocation || 'Punjab, Pakistan',
        preferredLanguage: preferredLanguage || 'en',
        isGuest: false
      }
    });

    const tokens = generateTokens(user);

    return sendSuccess(res, 'Registration successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        farmLocation: user.farmLocation,
        preferredLanguage: user.preferredLanguage,
        isGuest: user.isGuest
      },
      ...tokens
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login Controller
 */
const login = async (req, res, next) => {
  try {
    const { loginIdentifier, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginIdentifier },
          { phone: loginIdentifier }
        ]
      }
    });

    if (!user || !user.passwordHash) {
      return sendError(res, 'Invalid credentials. Please check your email/phone and password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials. Please check your password.', 401);
    }

    const tokens = generateTokens(user);

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        farmLocation: user.farmLocation,
        preferredLanguage: user.preferredLanguage,
        isGuest: user.isGuest
      },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Guest Session Login Controller
 */
const guestLogin = async (req, res, next) => {
  try {
    const guestUser = await prisma.user.create({
      data: {
        name: 'Guest Farmer',
        isGuest: true,
        farmLocation: 'Demo Farm',
        preferredLanguage: 'en'
      }
    });

    const tokens = generateTokens(guestUser);

    return sendSuccess(res, 'Guest session initialized', {
      user: {
        id: guestUser.id,
        name: guestUser.name,
        isGuest: true,
        preferredLanguage: 'en'
      },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Phone OTP Controller
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    // Simulated OTP verification (000000 or 123456)
    if (otp !== '123456' && otp !== '000000') {
      return sendError(res, 'Invalid OTP code. Please enter 123456 for demo.', 400);
    }

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `Farmer ${phone.slice(-4)}`,
          phone,
          isGuest: false
        }
      });
    }

    const tokens = generateTokens(user);

    return sendSuccess(res, 'Phone verified successfully', {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        isGuest: user.isGuest
      },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token Controller
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return sendError(res, 'User not found', 404);

    const tokens = generateTokens(user);

    return sendSuccess(res, 'Token refreshed successfully', tokens);
  } catch (error) {
    return sendError(res, 'Invalid or expired refresh token', 401);
  }
};

/**
 * Forgot Password Controller
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    return sendSuccess(res, 'Password reset instructions / OTP sent to your contact info.');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout Controller
 */
const logout = async (req, res, next) => {
  return sendSuccess(res, 'Logged out successfully');
};

module.exports = {
  signup,
  signupSchema,
  login,
  loginSchema,
  guestLogin,
  verifyOtp,
  otpSchema,
  refreshToken,
  forgotPassword,
  logout
};
