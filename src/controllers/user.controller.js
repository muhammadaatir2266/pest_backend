const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response.util');

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        farmLocation: true,
        preferredLanguage: true,
        isGuest: true,
        createdAt: true
      }
    });

    if (!user) return sendError(res, 'User profile not found', 404);

    return sendSuccess(res, 'Profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, farmLocation, preferredLanguage } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(farmLocation && { farmLocation }),
        ...(preferredLanguage && { preferredLanguage })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        farmLocation: true,
        preferredLanguage: true,
        isGuest: true,
        updatedAt: true
      }
    });

    return sendSuccess(res, 'Profile updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
