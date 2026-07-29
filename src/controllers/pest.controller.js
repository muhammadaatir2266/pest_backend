const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response.util');

const getPestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pest = await prisma.pest.findUnique({
      where: { id },
      include: {
        pestCrops: { include: { crop: true } },
        pestPesticides: { include: { pesticide: true } }
      }
    });

    if (!pest) return sendError(res, 'Pest not found', 404);

    return sendSuccess(res, 'Pest details retrieved', pest);
  } catch (error) {
    next(error);
  }
};

const searchPests = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const pests = await prisma.pest.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { scientificName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 20
    });

    return sendSuccess(res, 'Pests retrieved', pests);
  } catch (error) {
    next(error);
  }
};

const getPesticides = async (req, res, next) => {
  try {
    const { pestId } = req.query;

    if (pestId) {
      const pestPesticides = await prisma.pestPesticide.findMany({
        where: { pestId },
        include: { pesticide: true }
      });
      const pesticides = pestPesticides.map(pp => ({
        ...pp.pesticide,
        effectivenessRating: pp.effectivenessRating
      }));
      return sendSuccess(res, 'Pesticides retrieved for pest', pesticides);
    }

    const pesticides = await prisma.pesticide.findMany();
    return sendSuccess(res, 'All pesticides retrieved', pesticides);
  } catch (error) {
    next(error);
  }
};

const getCrops = async (req, res, next) => {
  try {
    const crops = await prisma.crop.findMany({
      orderBy: { name: 'asc' }
    });
    return sendSuccess(res, 'Crops list retrieved', crops);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPestById,
  searchPests,
  getPesticides,
  getCrops
};
