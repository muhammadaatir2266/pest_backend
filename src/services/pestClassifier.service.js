const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');
const logger = require('../config/logger');
const { detectPestWithYolo } = require('./yoloRunner.service');

// Fallback in-memory pests catalog mapped to IP102 agricultural pest species
const FALLBACK_PESTS = [
  {
    id: 'fb-aphids-id',
    name: 'Aphids (Greenflies)',
    scientificName: 'Myzus persicae',
    description: 'Small sap-sucking insects that cause leaf curling, stunting, and honeydew mold growth.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1590740880194-e6fae853ca6c?w=500',
    affectedCrops: [
      { cropName: 'Wheat', category: 'Cereal', damageDescription: 'Sucks sap from wheat tillers and ears, causing yellowing and yield drop.', severity: 'High' },
      { cropName: 'Cotton', category: 'Cash Crop', damageDescription: 'Transmits viral pathogens and leaves sticky honeydew on foliage.', severity: 'Medium' }
    ],
    recommendedPesticides: [
      { name: 'Neem Oil Botanical Extract', activeIngredient: 'Azadirachtin 0.15% EC', type: 'organic', dosage: '5 ml per liter of water', applicationMethod: 'Foliar spray early morning or late evening. Repeat every 7 days.', safetyNotes: 'Non-toxic to humans and bees. Safe organic option.', effectivenessRating: 'High (Organic)' },
      { name: 'Imidacloprid 200 SL', activeIngredient: 'Imidacloprid 17.8% SL', type: 'chemical', dosage: '0.5 ml per liter of water (50-100 ml/acre)', applicationMethod: 'Foliar spray at early infestation threshold.', safetyNotes: 'Wear gloves and mask during spray. Keep away from honey bees during flowering.', effectivenessRating: 'Essential (Chemical)' }
    ]
  },
  {
    id: 'fb-armyworm-id',
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    description: 'Voracious caterpillar that eats leaves, whorls, and ears of maize and wheat crops.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1551085254-e96b210df58a?w=500',
    affectedCrops: [
      { cropName: 'Maize', category: 'Cereal', damageDescription: 'Defoliation of maize leaves and severe damage to growing whorls.', severity: 'Severe' },
      { cropName: 'Wheat', category: 'Cereal', damageDescription: 'Chews through young stems and emerging tillers.', severity: 'High' }
    ],
    recommendedPesticides: [
      { name: 'Emamectin Benzoate 5% SG', activeIngredient: 'Emamectin Benzoate', type: 'chemical', dosage: '0.4 grams per liter of water (80g/acre)', applicationMethod: 'Target plant foliage and whorls where larvae feed.', safetyNotes: 'Harmful if swallowed or inhaled. Avoid direct contact with skin.', effectivenessRating: 'Essential' },
      { name: 'Bacillus thuringiensis (Bt) Bio-Insecticide', activeIngredient: 'Bt Kurstaki Strain', type: 'organic', dosage: '2 grams per liter of water', applicationMethod: 'Spray directly on crop leaves when young caterpillars appear.', safetyNotes: 'Eco-friendly and organic certified. Safe for beneficial insects.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-whitefly-id',
    name: 'Whitefly',
    scientificName: 'Bemisia tabaci',
    description: 'Tiny white flying insects sucking sap from cotton and tomato leaves, transmitting leaf curl viruses.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1543536448-1e76fc2795bf?w=500',
    affectedCrops: [
      { cropName: 'Cotton', category: 'Cash Crop', damageDescription: 'Causes soot mold and spreads Cotton Leaf Curl Virus (CLCV).', severity: 'Severe' },
      { cropName: 'Tomato', category: 'Vegetable', damageDescription: 'Sucks plant sap and transmits Tomato Yellow Leaf Curl Virus.', severity: 'High' }
    ],
    recommendedPesticides: [
      { name: 'Imidacloprid 200 SL', activeIngredient: 'Imidacloprid 17.8% SL', type: 'chemical', dosage: '0.5 ml per liter of water (50-100 ml/acre)', applicationMethod: 'Foliar spray at early infestation threshold.', safetyNotes: 'Wear gloves and mask during spray.', effectivenessRating: 'Essential' },
      { name: 'Neem Oil Botanical Extract', activeIngredient: 'Azadirachtin 0.15% EC', type: 'organic', dosage: '5 ml per liter of water', applicationMethod: 'Foliar spray early morning or late evening.', safetyNotes: 'Safe organic option.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-ladybug-id',
    name: 'Ladybug (Ladybird Beetle)',
    scientificName: 'Coccinellidae',
    description: 'Beneficial predatory insect that feeds on aphids and mites. Highly beneficial for crops!',
    isHarmfulDefault: false,
    imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500',
    affectedCrops: [],
    recommendedPesticides: []
  },
  {
    id: 'fb-bollworm-id',
    name: 'Pink Bollworm / Cotton Bollworm',
    scientificName: 'Pectinophora gossypiella',
    description: 'Destructive moth larva that bores inside cotton bolls, destroying lint quality and seed yield.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500',
    affectedCrops: [
      { cropName: 'Cotton', category: 'Cash Crop', damageDescription: 'Larvae bore into green bolls, causing lint staining and premature boll drop.', severity: 'Severe' }
    ],
    recommendedPesticides: [
      { name: 'Spinetoram 11.7% SC', activeIngredient: 'Spinetoram', type: 'chemical', dosage: '0.8 ml per liter of water (160 ml/acre)', applicationMethod: 'Foliar spray at early boll formation stage.', safetyNotes: 'Toxic to aquatic organisms. Do not spray near water bodies.', effectivenessRating: 'Essential' }
    ]
  },
  {
    id: 'fb-stemborer-id',
    name: 'Rice Stem Borer',
    scientificName: 'Scirpophaga incertulas',
    description: 'Boring caterpillar that causes "dead hearts" in tillers and "white heads" in rice crops.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500',
    affectedCrops: [
      { cropName: 'Rice', category: 'Grain', damageDescription: 'Bores into rice stems, preventing grain filling and causing hollow white panicles.', severity: 'Severe' }
    ],
    recommendedPesticides: [
      { name: 'Chlorantraniliprole 18.5% SC', activeIngredient: 'Chlorantraniliprole', type: 'chemical', dosage: '0.4 ml per liter of water (50 ml/acre)', applicationMethod: 'Apply at early stem elongation stage.', safetyNotes: 'Low mammalian toxicity.', effectivenessRating: 'Essential' }
    ]
  }
];

/**
 * Fetch pest catalog from database with fallback to in-memory catalog
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

  if (!pests || pests.length === 0) {
    pests = FALLBACK_PESTS;
  }

  return pests;
}

/**
 * Match YOLO11s IP102 detected class name to catalog pest
 */
function findPestByYoloClass(pests, yoloClassName) {
  if (!yoloClassName) return pests[0];
  const nameLower = yoloClassName.toLowerCase();

  const found = pests.find(p =>
    p.name.toLowerCase().includes(nameLower) ||
    nameLower.includes(p.name.toLowerCase()) ||
    (p.scientificName && p.scientificName.toLowerCase().includes(nameLower))
  );

  if (found) return found;

  // Keyword fuzzy matching
  if (nameLower.includes('aphid') || nameLower.includes('greenfly')) return pests.find(p => p.id === 'fb-aphids-id') || pests[0];
  if (nameLower.includes('armyworm') || nameLower.includes('caterpillar')) return pests.find(p => p.id === 'fb-armyworm-id') || pests[0];
  if (nameLower.includes('whitefly') || nameLower.includes('fly')) return pests.find(p => p.id === 'fb-whitefly-id') || pests[0];
  if (nameLower.includes('ladybug') || nameLower.includes('ladybird') || nameLower.includes('beetle')) return pests.find(p => p.id === 'fb-ladybug-id') || pests[0];
  if (nameLower.includes('bollworm') || nameLower.includes('moth')) return pests.find(p => p.id === 'fb-bollworm-id') || pests[0];
  if (nameLower.includes('borer') || nameLower.includes('stem')) return pests.find(p => p.id === 'fb-stemborer-id') || pests[0];

  return pests[0];
}

/**
 * MAIN FUNCTION: Classify & Detect Pests using YOLO11s Object Detection
 * Model: underdogquality/yolo11s-pest-detection (IP102 Dataset, 102 Classes)
 */
async function classifyPestImage(imagePath) {
  logger.info(`=== Starting YOLO11s Pest Object Detection for ${path.basename(imagePath)} ===`);

  const confThreshold = parseFloat(process.env.YOLO_CONF_THRESHOLD || 0.55);

  // Execute YOLO11s Object Detection Microservice
  const yoloResult = await detectPestWithYolo(imagePath, confThreshold);

  if (yoloResult && yoloResult.success && yoloResult.isPestDetected && yoloResult.topDetection) {
    const top = yoloResult.topDetection;
    const pestClassName = top.className;
    const confidence = top.confidence;
    const boundingBox = top.boundingBox; // [x1, y1, x2, y2]

    logger.info(`✅ YOLO11s Pest Detected: "${pestClassName}" (Confidence: ${(confidence * 100).toFixed(1)}%, bbox: ${JSON.stringify(boundingBox)})`);

    const pests = await fetchPestCatalog();
    const matchedPest = findPestByYoloClass(pests, pestClassName);
    const finalPest = matchedPest || pests[0] || FALLBACK_PESTS[0];

    return {
      isPestDetected: true,
      pestId: finalPest.id,
      pest: {
        id: finalPest.id,
        name: `${finalPest.name} (${pestClassName})`,
        scientificName: finalPest.scientificName,
        description: finalPest.description,
        isHarmful: finalPest.isHarmfulDefault,
        imageUrl: finalPest.imageUrl
      },
      confidenceScore: confidence,
      boundingBox: boundingBox, // Object detection bounding box coordinates [x1, y1, x2, y2]
      allDetections: yoloResult.allDetections || [],
      isHarmful: finalPest.isHarmfulDefault,
      affectedCrops: finalPest.affectedCrops || [],
      recommendedPesticides: finalPest.recommendedPesticides || [],
      message: `Pest detected: ${pestClassName} (${(confidence * 100).toFixed(1)}% confidence)`
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
  FALLBACK_PESTS
};
