const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');
const logger = require('../config/logger');
const { detectPestWithYolo } = require('./yoloRunner.service');
const { getIp102Metadata, IP102_SPECIES_MAP } = require('../config/ip102Catalog');

/**
 * Fetch pest catalog from database with fallback to in-memory IP102 species
 */
async function fetchPestCatalog() {
  let pests = [];
  try {
    const fetchDbPromise = prisma.pest.findMany({
      include: {
        pestCrops: { include: { crop: true } },
        pestPesticides: { include: { pesticide: true } }
      }
    });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), 3000)
    );

    const dbPests = await Promise.race([fetchDbPromise, timeoutPromise]);

    if (dbPests && dbPests.length > 0) {
      pests = dbPests.map(p => ({
        id: p.id,
        name: p.name,
        scientificName: p.scientificName,
        description: p.description,
        isHarmfulDefault: p.isHarmfulDefault,
        imageUrl: p.imageUrl,
        affectedCrops: p.pestCrops.map(pc => ({
          cropName: pc.crop.name,
          category: pc.crop.category,
          damageDescription: pc.damageDescription,
          severity: pc.severity
        })),
        recommendedPesticides: p.pestPesticides.map(pp => ({
          name: pp.pesticide.name,
          activeIngredient: pp.pesticide.activeIngredient,
          type: pp.pesticide.type,
          dosage: pp.pesticide.dosage,
          applicationMethod: pp.pesticide.applicationMethod,
          safetyNotes: pp.pesticide.safetyNotes,
          effectivenessRating: pp.effectivenessRating
        }))
      }));
    }
  } catch (err) {
    logger.warn(`Database pest fetch failed: ${err.message}`);
  }

  return pests;
}

/**
 * MAIN FUNCTION: Classify & Detect Pests using YOLO11s Object Detection
 * Model: underdogquality/yolo11s-pest-detection (IP102 Dataset, 102 Species)
 */
async function classifyPestImage(imagePath) {
  logger.info(`=== Starting YOLO11s Pest Object Detection for ${path.basename(imagePath)} ===`);

  // Default optimal threshold for IP102 field detection is 0.45
  const confThreshold = parseFloat(process.env.YOLO_CONF_THRESHOLD || 0.45);

  // Execute YOLO11s Object Detection Microservice
  const yoloResult = await detectPestWithYolo(imagePath, confThreshold);

  if (yoloResult && yoloResult.success && yoloResult.isPestDetected && yoloResult.topDetection) {
    const top = yoloResult.topDetection;
    const classId = top.classId;
    const pestClassName = top.className;
    const confidence = top.confidence;
    const boundingBox = top.boundingBox; // [x1, y1, x2, y2]

    // Fetch full metadata for detected IP102 species (0-101)
    const ip102Meta = getIp102Metadata(classId) || getIp102Metadata(pestClassName);

    logger.info(`🎯 YOLO11s Pest Detected [Class #${classId}]: "${ip102Meta.name}" (${ip102Meta.scientificName}) - Confidence: ${(confidence * 100).toFixed(1)}%, bbox: ${JSON.stringify(boundingBox)}`);

    // Check DB catalog for optional custom images or IDs
    const dbPests = await fetchPestCatalog();
    const dbMatch = dbPests.find(p =>
      p.name.toLowerCase().includes(pestClassName.toLowerCase()) ||
      pestClassName.toLowerCase().includes(p.name.toLowerCase())
    );

    const finalPestId = dbMatch ? dbMatch.id : `ip102-class-${classId}`;
    const finalImageUrl = dbMatch ? dbMatch.imageUrl : 'https://images.unsplash.com/photo-1590740880194-e6fae853ca6c?w=500';

    // Enrich all detections list
    const enrichedAllDetections = (yoloResult.allDetections || []).map(det => {
      const meta = getIp102Metadata(det.classId) || getIp102Metadata(det.className);
      return {
        ...det,
        displayName: meta.name,
        scientificName: meta.scientificName,
        isHarmful: meta.isHarmful
      };
    });

    return {
      isPestDetected: true,
      pestId: finalPestId,
      pest: {
        id: finalPestId,
        name: ip102Meta.name,
        scientificName: ip102Meta.scientificName,
        description: ip102Meta.description,
        isHarmful: ip102Meta.isHarmful,
        imageUrl: finalImageUrl
      },
      confidenceScore: confidence,
      boundingBox: boundingBox, // Coordinates [x1, y1, x2, y2] in pixels
      allDetections: enrichedAllDetections,
      isHarmful: ip102Meta.isHarmful,
      affectedCrops: ip102Meta.affectedCrops || [],
      recommendedPesticides: ip102Meta.recommendedPesticides || [],
      message: `Pest detected: ${ip102Meta.name} (${(confidence * 100).toFixed(1)}% confidence)`
    };
  }

  // No pest detected above confidence threshold
  logger.info(`🚫 YOLO11s: No pest object detected above confidence threshold (${confThreshold.toFixed(2)})`);
  return {
    isPestDetected: false,
    pestId: null,
    pest: null,
    confidenceScore: 0,
    boundingBox: null,
    allDetections: [],
    isHarmful: false,
    message: `No agricultural pest detected above confidence threshold (${confThreshold.toFixed(2)}).`,
    affectedCrops: [],
    recommendedPesticides: []
  };
}

module.exports = {
  classifyPestImage,
  IP102_SPECIES_MAP
};
