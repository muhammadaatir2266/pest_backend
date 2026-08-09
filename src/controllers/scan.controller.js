const prisma = require('../config/database');
const { classifyPestImage } = require('../services/pestClassifier.service');
const { uploadPestImage } = require('../services/storage.service');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Process new pest image scan
 */
const createScan = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No pest image uploaded. Please attach an image file.', 400);
    }

    const userId = req.user ? req.user.userId : null;

    // Execute Hugging Face AI Vision Model Classification
    const analysis = await classifyPestImage(req.file.path);

    // Upload image to Cloud Storage (Cloudinary) or fallback to local static URL
    const imageUrl = await uploadPestImage(req.file);

    let savedScan = null;
    if (userId) {
      savedScan = await prisma.scan.create({
        data: {
          userId,
          pestId: analysis.pestId || null,
          imageUrl,
          confidenceScore: analysis.confidenceScore,
          isHarmful: analysis.isHarmful,
          notes: req.body.notes || null
        }
      });
    }

    return sendSuccess(res, analysis.isPestDetected ? 'Pest analysis completed successfully' : 'No pest detected', {
      scanId: savedScan ? savedScan.id : 'guest-scan-id',
      imageUrl,
      isPestDetected: analysis.isPestDetected,
      message: analysis.message || (analysis.isPestDetected ? 'Pest detected' : 'No pest detected'),
      pest: analysis.pest,
      confidenceScore: analysis.confidenceScore,
      isHarmful: analysis.isHarmful,
      affectedCrops: analysis.affectedCrops,
      recommendedPesticides: analysis.recommendedPesticides,
      createdAt: savedScan ? savedScan.createdAt : new Date().toISOString()
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user scan history
 */
const getScans = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, scans] = await Promise.all([
      prisma.scan.count({ where: { userId } }),
      prisma.scan.findMany({
        where: { userId },
        include: {
          pest: {
            include: {
              pestCrops: { include: { crop: true } },
              pestPesticides: { include: { pesticide: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ]);

    const formattedScans = scans.map(s => ({
      id: s.id,
      imageUrl: s.imageUrl,
      confidenceScore: s.confidenceScore,
      isHarmful: s.isHarmful,
      createdAt: s.createdAt,
      pestName: s.pest ? s.pest.name : 'Unknown Pest',
      scientificName: s.pest ? s.pest.scientificName : '',
      description: s.pest ? s.pest.description : '',
      affectedCrops: s.pest ? s.pest.pestCrops.map(pc => pc.crop.name) : [],
      recommendedPesticides: s.pest ? s.pest.pestPesticides.map(pp => pp.pesticide.name) : []
    }));

    return sendSuccess(res, 'Scan history retrieved successfully', {
      scans: formattedScans,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get scan details by ID
 */
const getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scan = await prisma.scan.findUnique({
      where: { id },
      include: {
        pest: {
          include: {
            pestCrops: { include: { crop: true } },
            pestPesticides: { include: { pesticide: true } }
          }
        }
      }
    });

    if (!scan) return sendError(res, 'Scan record not found', 404);

    return sendSuccess(res, 'Scan details retrieved', {
      id: scan.id,
      imageUrl: scan.imageUrl,
      confidenceScore: scan.confidenceScore,
      isHarmful: scan.isHarmful,
      createdAt: scan.createdAt,
      pest: scan.pest ? {
        id: scan.pest.id,
        name: scan.pest.name,
        scientificName: scan.pest.scientificName,
        description: scan.pest.description
      } : null,
      affectedCrops: scan.pest ? scan.pest.pestCrops.map(pc => ({
        cropName: pc.crop.name,
        damageDescription: pc.damageDescription,
        severity: pc.severity
      })) : [],
      recommendedPesticides: scan.pest ? scan.pest.pestPesticides.map(pp => ({
        name: pp.pesticide.name,
        activeIngredient: pp.pesticide.activeIngredient,
        type: pp.pesticide.type,
        dosage: pp.pesticide.dosage,
        applicationMethod: pp.pesticide.applicationMethod,
        safetyNotes: pp.pesticide.safetyNotes
      })) : []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete scan record
 */
const deleteScan = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.scan.delete({ where: { id } });
    return sendSuccess(res, 'Scan record deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createScan,
  getScans,
  getScanById,
  deleteScan
};
