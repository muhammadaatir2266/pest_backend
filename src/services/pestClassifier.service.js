const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const prisma = require('../config/database');
const logger = require('../config/logger');

const hfApiKey = process.env.HUGGINGFACE_API_KEY || '';
const hfModel = process.env.HUGGINGFACE_MODEL || 'underdogquality/yolo11s-pest-detection';

const NON_PEST_KEYWORDS = [
  'person', 'man', 'woman', 'human', 'face', 'boy', 'girl', 'people',
  'clothing', 'shoe', 'shirt', 'jacket', 'car', 'vehicle', 'dog', 'cat',
  'building', 'room', 'table', 'chair', 'wall', 'furniture', 'phone', 'laptop',
  'computer', 'monitor', 'keyboard', 'desk', 'office', 'screen', 'paper', 'book',
  'house', 'indoor', 'floor', 'ceiling', 'shadow', 'device', 'glass', 'cup', 'bottle',
  'notebook', 'display', 'television', 'tv', 'electronics', 'space bar', 'handheld',
  'cellular', 'telephone', 'modem', 'couch', 'pillow', 'carpet', 'lamp', 'door', 'window',
  'plate', 'mug', 'fork', 'spoon', 'stage', 'spotlight'
];

// Fallback in-memory pests database when remote Postgres is unreachable
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
  }
];

/**
 * Analyze image buffer using Sharp to detect human skin tones vs plant foliage
 * @param {string} imagePath
 */
async function analyzeImagePixels(imagePath) {
  if (!fs.existsSync(imagePath)) {
    return { isHumanOrInvalid: false, isPlantFoliage: false };
  }
  try {
    const { data, info } = await sharp(imagePath)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const totalPixels = info.width * info.height;
    let skinPixelCount = 0;
    let plantPixelCount = 0;
    let greenToneSum = 0;
    let redToneSum = 0;

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      redToneSum += r;
      greenToneSum += g;

      // Standard human skin tone heuristic in RGB space
      const isSkin = (r > 90) && (g > 55) && (b > 30) && (r > g) && (r > b) && ((r - g) >= 15);
      if (isSkin) skinPixelCount++;

      // Plant green / foliage / crop heuristic
      const isPlantGreen = (g > r) && (g > b) && (g > 30);
      if (isPlantGreen) plantPixelCount++;
    }

    const skinRatio = skinPixelCount / totalPixels;
    const plantRatio = plantPixelCount / totalPixels;
    const avgGreen = greenToneSum / totalPixels;
    const avgRed = redToneSum / totalPixels;

    logger.info(`Pixel analysis for ${path.basename(imagePath)}: skinRatio=${(skinRatio * 100).toFixed(1)}%, plantRatio=${(plantRatio * 100).toFixed(1)}%`);

    // Flag as non-plant if skin pixels are high (>60%) or if plant green is virtually absent (<3%) with low green tone
    const isHumanOrInvalid = (skinRatio > 0.60 && plantRatio < 0.05) || (plantRatio < 0.03 && avgGreen < 40 && skinRatio < 0.05);
    const isPlantFoliage = plantRatio > 0.04 || avgGreen > 40;

    return { isHumanOrInvalid, isPlantFoliage, skinRatio, plantRatio, avgGreen, avgRed };
  } catch (err) {
    logger.warn(`Pixel analysis failed: ${err.message}`);
    return { isHumanOrInvalid: false, isPlantFoliage: true };
  }
}

/**
 * Classify pest image using AI Vision Model & Smart Agricultural Fallback
 * @param {string} imagePath - Local file path of uploaded pest image
 */
async function classifyPestImage(imagePath) {
  let detectedLabel = null;
  let confidence = 0.88;

  // Step 1: Perform sharp image pixel analysis
  const pixelAnalysis = await analyzeImagePixels(imagePath);

  if (pixelAnalysis.isHumanOrInvalid) {
    logger.info(`Image classified as human/non-plant object based on pixel analysis.`);
    return {
      isPestDetected: false,
      pestId: null,
      pest: null,
      confidenceScore: 0,
      isHarmful: false,
      message: 'No pest or plant disease detected. The uploaded picture appears to contain a non-plant object, laptop, or human portrait. Please upload a clear photo of an affected crop leaf or insect pest.',
      affectedCrops: [],
      recommendedPesticides: []
    };
  }

  // Step 2: Attempt Hugging Face Inference Call if configured
  try {
    if (fs.existsSync(imagePath) && hfApiKey && hfApiKey !== 'hf_example_token_key') {
      logger.info(`Sending image to Hugging Face Vision model...`);
      const targetModels = [
        'microsoft/resnet-50',
        'google/vit-base-patch16-224',
        hfModel
      ];
      const imageBuffer = fs.readFileSync(imagePath);
      
      for (const modelName of targetModels) {
        if (!modelName) continue;
        const endpoints = [
          `https://router.huggingface.co/hf-inference/models/${modelName}`,
          `https://router.huggingface.co/hf-inference/v1/models/${modelName}`
        ];

        for (const endpoint of endpoints) {
          try {
            const hfRes = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${hfApiKey}`,
                'Content-Type': 'application/octet-stream',
              },
              body: imageBuffer,
              signal: AbortSignal.timeout(2500)
            });

            if (hfRes.ok) {
              const response = await hfRes.json();
              if (Array.isArray(response) && response.length > 0) {
                const topResult = response[0];
                const rawLabel = (topResult.label || topResult.class || '').toLowerCase();
                const score = topResult.score || topResult.confidence || 0.85;

                // Check if top result is explicit non-pest object
                const isExplicitNonPest = NON_PEST_KEYWORDS.some(kw => rawLabel.includes(kw));
                if (isExplicitNonPest) {
                  logger.info(`Hugging Face detected non-pest label: ${rawLabel} (${score})`);
                  return {
                    isPestDetected: false,
                    pestId: null,
                    pest: null,
                    confidenceScore: Math.round(score * 100) / 100,
                    isHarmful: false,
                    message: `No pest detected in the image (detected: ${topResult.label}). Please take a clear picture of an affected crop leaf or insect pest.`,
                    affectedCrops: [],
                    recommendedPesticides: []
                  };
                }

                detectedLabel = topResult.label || topResult.class;
                confidence = Math.round(score * 100) / 100;
                logger.info(`Hugging Face AI Vision model (${modelName}) detected label: ${detectedLabel} (confidence: ${confidence})`);
                break;
              }
            }
          } catch (e) {
            logger.warn(`HF model ${modelName} endpoint error: ${e.message}`);
          }
        }
        if (detectedLabel) break;
      }
    }
  } catch (err) {
    logger.warn(`Hugging Face Vision API call skipped/failed: ${err.message}`);
  }

  // Step 3: Fetch pests from Prisma DB with fallback to in-memory pest database
  let pests = [];
  try {
    const fetchDbPromise = prisma.pest.findMany({
      include: {
        pestCrops: { include: { crop: true } },
        pestPesticides: { include: { pesticide: true } }
      }
    });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 800)
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
    logger.warn(`Database pest fetch failed, using fallback pest catalog: ${err.message}`);
  }

  if (!pests || pests.length === 0) {
    pests = FALLBACK_PESTS;
  }

  // Step 4: Find matching pest in catalog
  let matchedPest = null;
  if (detectedLabel) {
    matchedPest = pests.find(p =>
      p.name.toLowerCase().includes(detectedLabel.toLowerCase()) ||
      (p.scientificName && p.scientificName.toLowerCase().includes(detectedLabel.toLowerCase()))
    );
  }

  // If no explicit model pest label matched, strictly report no pest detected
  if (!matchedPest) {
    logger.info(`No explicit pest label matched for image ${path.basename(imagePath)}`);
    return {
      isPestDetected: false,
      pestId: null,
      pest: null,
      confidenceScore: 0,
      isHarmful: false,
      message: 'No pest or plant disease detected in this image. Please take a clear picture of an affected crop leaf or insect pest.',
      affectedCrops: [],
      recommendedPesticides: []
    };
  }

  return {
    isPestDetected: true,
    pestId: matchedPest.id,
    pest: {
      id: matchedPest.id,
      name: matchedPest.name,
      scientificName: matchedPest.scientificName,
      description: matchedPest.description,
      isHarmful: matchedPest.isHarmfulDefault,
      imageUrl: matchedPest.imageUrl
    },
    confidenceScore: confidence,
    isHarmful: matchedPest.isHarmfulDefault,
    affectedCrops: matchedPest.affectedCrops || [],
    recommendedPesticides: matchedPest.recommendedPesticides || []
  };
}

module.exports = {
  classifyPestImage,
};
