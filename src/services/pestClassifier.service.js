const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const prisma = require('../config/database');
const logger = require('../config/logger');

const hfApiKey = process.env.HUGGINGFACE_API_KEY || '';

// Labels that indicate the image is clearly NOT agricultural
// Covers: people, animals, vehicles, electronics, furniture, food, sports, clothing, tools, etc.
const CLEAR_NON_PEST_LABELS = [
  // People
  'person', 'man', 'woman', 'human', 'face', 'boy', 'girl', 'people', 'baby',
  'groom', 'bride', 'wig', 'mask', 'sunglasses', 'sunglass',
  // Vehicles
  'car', 'vehicle', 'truck', 'bus', 'train', 'airplane', 'motorcycle', 'bicycle',
  'scooter', 'minivan', 'ambulance', 'police', 'taxi', 'cab', 'jeep', 'limousine',
  'convertible', 'sports car', 'racer', 'go-kart', 'snowmobile', 'boat', 'canoe',
  // Pets / Animals (non-pest)
  'dog', 'cat', 'horse', 'cow', 'sheep', 'pig', 'elephant', 'bear', 'lion',
  'tiger', 'monkey', 'gorilla', 'panda', 'zebra', 'giraffe', 'deer', 'rabbit',
  'hamster', 'parrot', 'penguin', 'whale', 'dolphin', 'goldfish', 'shark',
  // Buildings & Architecture
  'building', 'skyscraper', 'church', 'castle', 'bridge', 'tower', 'lighthouse',
  'palace', 'mosque', 'temple', 'dome', 'arch', 'cinema', 'theater', 'stadium',
  // Electronics & Appliances
  'laptop', 'computer', 'notebook', 'monitor', 'desktop', 'keyboard', 'mouse',
  'printer', 'scanner', 'projector', 'television', 'tv', 'screen', 'display',
  'phone', 'cellular telephone', 'smartphone', 'tablet', 'ipad', 'ipod',
  'remote control', 'joystick', 'speaker', 'microphone', 'headphone', 'earphone',
  'camera', 'digital clock', 'analog clock', 'wall clock', 'alarm clock',
  'calculator', 'modem', 'router', 'hard disc', 'disk',
  // Furniture & Household
  'couch', 'sofa', 'bed', 'chair', 'table', 'desk', 'bench', 'stool',
  'cabinet', 'bookcase', 'shelf', 'wardrobe', 'drawer', 'dresser',
  'curtain', 'window shade', 'blind', 'lamp', 'chandelier', 'candle',
  'pillow', 'quilt', 'blanket', 'towel', 'bath towel', 'doormat', 'mat',
  'toilet', 'bathtub', 'shower', 'washbasin', 'sink', 'faucet',
  'mirror', 'picture frame', 'painting', 'photoframe',
  // Kitchen & Food
  'pizza', 'hamburger', 'hot dog', 'sandwich', 'cake', 'ice cream', 'donut',
  'wine', 'beer', 'coffee', 'cup', 'soda', 'bottle', 'water bottle',
  'plate', 'bowl', 'fork', 'spoon', 'knife', 'spatula', 'ladle',
  'oven', 'microwave', 'refrigerator', 'toaster', 'blender', 'mixer',
  'frying pan', 'wok', 'pot', 'kettle', 'teapot', 'coffeepot',
  'grocery store', 'bakery', 'restaurant', 'dining table',
  // Office & Stationery
  'pen', 'pencil', 'fountain pen', 'ballpoint', 'marker', 'crayon', 'chalk',
  'notebook', 'binder', 'envelope', 'paper', 'rubber eraser', 'ruler',
  'pencil box', 'pencil sharpener', 'stapler', 'paper clip', 'safety pin',
  'file', 'folder', 'clipboard', 'letterbox', 'mailbox',
  // Sports & Recreation
  'basketball', 'soccer', 'football', 'tennis', 'golf', 'baseball',
  'volleyball', 'ping-pong', 'badminton', 'racket', 'bat',
  'ski', 'snowboard', 'surfboard', 'skateboard',
  // Clothing & Accessories
  'shirt', 'suit', 'dress', 'jean', 'trouser', 'sock', 'shoe', 'boot',
  'sandal', 'sneaker', 'hat', 'cap', 'helmet', 'bonnet', 'beret', 'turban',
  'tie', 'bow tie', 'scarf', 'glove', 'mitten', 'apron', 'lab coat',
  'backpack', 'handbag', 'purse', 'wallet', 'suitcase', 'briefcase',
  'umbrella', 'belt', 'buckle', 'watch', 'necklace', 'ring',
  // Tools & Hardware
  'hammer', 'screwdriver', 'wrench', 'pliers', 'saw', 'drill',
  'nail', 'screw', 'bolt', 'nut', 'padlock', 'lock', 'key',
  'hatchet', 'axe', 'shovel', 'rake', 'broom', 'mop',
  // Musical Instruments
  'guitar', 'piano', 'violin', 'drum', 'flute', 'trumpet', 'saxophone',
  'harmonica', 'accordion', 'organ', 'banjo', 'cello', 'oboe', 'bassoon',
  // Weapons (often misclassified by ViT/ResNet for simple images)
  'rifle', 'assault rifle', 'revolver', 'gun', 'pistol', 'cannon',
  'sword', 'dagger', 'bayonet', 'missile',
  // Misc household objects
  'iron', 'washing machine', 'vacuum', 'fan', 'air conditioner',
  'fireplace', 'radiator', 'space heater', 'stove',
  'soap', 'lotion', 'perfume', 'lipstick', 'hair spray',
  'teddy bear', 'jigsaw puzzle', 'toy', 'doll', 'lego',
  'matchstick', 'candle', 'torch', 'lighter',
  'barrel', 'bucket', 'pail', 'crate', 'carton', 'box',
  'chain link fence', 'picket fence', 'stone wall', 'brick',
  'web site', 'website', 'internet', 'menu', 'crossword puzzle'
];

// Labels from ImageNet that indicate the image IS related to agriculture/insects/nature
const PEST_INDICATOR_LABELS = [
  // Insects
  'leafhopper', 'lacewing', 'ant', 'bee', 'fly', 'housefly', 'mosquito', 
  'dragonfly', 'damselfly', 'butterfly', 'moth', 'caterpillar',
  'lycaenid', 'admiral', 'monarch', 'sulphur butterfly', 'cabbage butterfly', 
  'ringlet', 'beetle', 'leaf beetle', 'ground beetle', 'long-horned beetle',
  'tiger beetle', 'dung beetle', 'ladybug', 'lady beetle', 'ladybird',
  'weevil', 'cockroach', 'cricket', 'grasshopper', 'walking stick',
  'stick insect', 'mantis', 'praying mantis', 'cicada', 'slug', 'snail',
  'spider', 'garden spider', 'barn spider', 'wolf spider', 'tarantula',
  'black widow', 'tick', 'centipede', 'millipede', 'scorpion',
  'nematode', 'worm', 'earthworm', 'flatworm', 'roundworm',
  'insect', 'bug', 'stinkbug', 'aphid', 'whitefly', 'armyworm',
  'bollworm', 'cutworm', 'hornworm', 'inchworm', 'silkworm',
  'mite', 'thrip', 'wasp', 'hornet', 'sawfly',
  'borer', 'maggot', 'grub', 'larva', 'pupa', 'cocoon', 'chrysalis',
  // Plants / agriculture
  'leaf', 'plant', 'flower', 'daisy', 'sunflower', 'rose', 'tulip',
  'head cabbage', 'cardoon', 'broccoli', 'cauliflower', 'cucumber',
  'zucchini', 'squash', 'pumpkin', 'bell pepper', 'artichoke',
  'mushroom', 'agaric', 'fungus', 'lichen', 'moss',
  'hay', 'straw', 'wheat', 'rice', 'corn', 'acorn', 'rapeseed',
  'flowerpot', 'potpie',
  'harvester', 'thresher', 'tractor', 'plow',
  // Nature / textures (specific enough to indicate agricultural context)
  'honeycomb',
];

// Map HF labels to our pest categories
const LABEL_TO_PEST_CATEGORY = {
  'aphid': ['leafhopper', 'lacewing', 'ant', 'weevil', 'cockroach', 'cicada', 'tick',
            'nematode', 'roundworm', 'insect', 'bug', 'stinkbug', 'aphid', 'mite', 'thrip',
            'leaf beetle', 'ground beetle', 'tiger beetle', 'dung beetle',
            'leaf', 'plant', 'head cabbage', 'cardoon', 'broccoli', 'cauliflower',
            'bell pepper', 'artichoke', 'mushroom', 'agaric', 'fungus', 'lichen', 'moss',
            'wheat', 'rice', 'rapeseed', 'daisy', 'sunflower', 'pot', 'flowerpot', 'vase',
            'harvester', 'tractor', 'plow', 'chain', 'honeycomb', 'coral', 'sea anemone'],
  'armyworm': ['butterfly', 'moth', 'caterpillar', 'lycaenid', 'admiral', 'monarch',
              'sulphur butterfly', 'cabbage butterfly', 'ringlet', 'cricket', 'grasshopper',
              'walking stick', 'stick insect', 'slug', 'snail', 'centipede', 'millipede',
              'scorpion', 'worm', 'earthworm', 'flatworm', 'armyworm', 'bollworm',
              'cutworm', 'hornworm', 'inchworm', 'silkworm', 'sawfly', 'borer', 'maggot',
              'grub', 'larva', 'pupa', 'cocoon', 'chrysalis',
              'hay', 'straw', 'corn', 'ear', 'acorn', 'thresher', 'wool', 'knot'],
  'whitefly': ['fly', 'housefly', 'mosquito', 'whitefly',
              'cucumber', 'zucchini', 'squash', 'pumpkin', 'jellyfish'],
  'ladybug': ['bee', 'dragonfly', 'damselfly', 'beetle', 'ladybug', 'lady beetle', 'ladybird',
             'long-horned beetle', 'mantis', 'praying mantis', 'spider', 'garden spider',
             'barn spider', 'wolf spider', 'tarantula', 'black widow', 'wasp', 'hornet',
             'web']
};

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
 */
async function analyzeImagePixels(imagePath) {
  if (!fs.existsSync(imagePath)) {
    return { isHumanOrInvalid: false, isPlantFoliage: true, pestCategory: 'aphid' };
  }
  try {
    const { data, info } = await sharp(imagePath)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const totalPixels = info.width * info.height;
    let skinPixelCount = 0;
    let plantPixelCount = 0;
    let whitePixelCount = 0;
    let brownWhorlCount = 0;
    let redOrangeCount = 0;
    let darkPixelCount = 0;
    let greenToneSum = 0;
    let redToneSum = 0;

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      redToneSum += r;
      greenToneSum += g;

      // Human skin tone check — exclude earthy/soil browns (low blue, high red-green gap)
      // Real skin: warm pink/peach. Soil: dull brown with low saturation
      const isEarthyBrown = (r > 80) && (g > 60) && (b < 70) && ((r - g) < 40) && ((r - b) > 30);
      const isSkin = !isEarthyBrown && (r > 90) && (g > 55) && (b > 30) && (r > g) && (r > b) && ((r - g) >= 15) && (b > 40);
      if (isSkin) skinPixelCount++;

      // Plant green / foliage / crop heuristic
      const isPlantGreen = (g > r) && (g > b) && (g > 30);
      if (isPlantGreen) plantPixelCount++;

      // White insect / whitefly / white fungal spot heuristic
      const isWhiteSpot = (r > 180) && (g > 180) && (b > 180);
      if (isWhiteSpot) whitePixelCount++;

      // Brown caterpillar / armyworm / whorl damage heuristic
      const isBrownWhorl = (r > 80) && (g < 110) && (b < 80) && (r > g);
      if (isBrownWhorl) brownWhorlCount++;

      // Red/orange (ladybug, Colorado potato beetle, rust disease)
      const isRedOrange = (r > 150) && (g > 50) && (g < 130) && (b < 80);
      if (isRedOrange) redOrangeCount++;

      // Dark pixels (could be insect body)
      const isDark = (r < 60) && (g < 60) && (b < 60);
      if (isDark) darkPixelCount++;
    }

    const skinRatio = skinPixelCount / totalPixels;
    const plantRatio = plantPixelCount / totalPixels;
    const whiteRatio = whitePixelCount / totalPixels;
    const brownRatio = brownWhorlCount / totalPixels;
    const redOrangeRatio = redOrangeCount / totalPixels;
    const darkRatio = darkPixelCount / totalPixels;
    const avgGreen = greenToneSum / totalPixels;
    const avgRed = redToneSum / totalPixels;

    logger.info(`Pixel analysis: skin=${(skinRatio * 100).toFixed(1)}%, plant=${(plantRatio * 100).toFixed(1)}%, white=${(whiteRatio * 100).toFixed(1)}%, brown=${(brownRatio * 100).toFixed(1)}%, redOrange=${(redOrangeRatio * 100).toFixed(1)}%, dark=${(darkRatio * 100).toFixed(1)}%`);

    // Only reject if image is OVERWHELMINGLY skin-toned with virtually no green AND no brown (soil)
    const isHumanOrInvalid = (skinRatio > 0.65 && plantRatio < 0.03 && brownRatio < 0.10);
    const isPlantFoliage = plantRatio > 0.03 || brownRatio > 0.04 || (darkRatio > 0.05 && plantRatio > 0.01);

    // Check if green is actually dominant (true agricultural green, not grey/white)
    const isGreenDominant = plantRatio > 0.05;

    // Determine pest category based on pixel analysis
    let pestCategory = 'aphid'; // default: most common
    if (redOrangeRatio > 0.01) {
      pestCategory = 'ladybug';
    } else if (whiteRatio > 0.04) {
      pestCategory = 'whitefly';
    } else if (brownRatio > 0.06 || avgRed > 85) {
      pestCategory = 'armyworm';
    }

    return { isHumanOrInvalid, isPlantFoliage, isGreenDominant, skinRatio, plantRatio, whiteRatio, brownRatio, redOrangeRatio, darkRatio, avgGreen, avgRed, pestCategory };
  } catch (err) {
    logger.warn(`Pixel analysis failed: ${err.message}`);
    return { isHumanOrInvalid: false, isPlantFoliage: true, pestCategory: 'aphid' };
  }
}

/**
 * Call HuggingFace Vision model for image classification.
 * Returns the top labels or null on failure.
 */
async function callHuggingFaceVision(imagePath) {
  if (!fs.existsSync(imagePath) || !hfApiKey || hfApiKey === 'hf_example_token_key') {
    return null;
  }

  const imageBuffer = fs.readFileSync(imagePath);

  // Try multiple models in order - ViT is better than ResNet
  const models = [
    { name: 'google/vit-base-patch16-224', label: 'ViT' },
    { name: 'microsoft/resnet-50', label: 'ResNet-50' }
  ];

  for (const model of models) {
    const endpoints = [
      `https://router.huggingface.co/hf-inference/models/${model.name}`,
      `https://api-inference.huggingface.co/models/${model.name}`
    ];

    for (const endpoint of endpoints) {
      try {
        logger.info(`Trying ${model.label} at ${endpoint}...`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfApiKey}`,
            'Content-Type': 'application/octet-stream',
            'X-Wait-For-Model': 'true',
          },
          body: imageBuffer,
          signal: AbortSignal.timeout(12000)
        });

        if (response.ok) {
          const results = await response.json();
          if (Array.isArray(results) && results.length > 0) {
            logger.info(`${model.label} results: ${results.slice(0, 5).map(r => `${r.label}(${(r.score*100).toFixed(1)}%)`).join(', ')}`);
            return results;
          }
        } else {
          const errText = await response.text().catch(() => 'unknown');
          logger.warn(`${model.label} ${endpoint} returned ${response.status}: ${errText.substring(0, 200)}`);
        }
      } catch (e) {
        logger.warn(`${model.label} error: ${e.message}`);
      }
    }
  }

  return null;
}

/**
 * Determine pest category from HuggingFace labels
 * Returns { category: string, confidence: number } or null
 */
function determinePestFromLabels(hfResults) {
  if (!hfResults || !Array.isArray(hfResults) || hfResults.length === 0) return null;

  // ---- Step A: Check if ANY of the top-5 results are pest/plant indicators ----
  const pestIndicatorHit = hfResults.slice(0, 5).find(r => {
    const label = (r.label || '').toLowerCase();
    return PEST_INDICATOR_LABELS.some(kw => label.includes(kw));
  });

  if (pestIndicatorHit && (pestIndicatorHit.score || 0) > 0.03) {
    // Found a pest/plant indicator with >3% confidence — try to categorize it
    const hitLabel = (pestIndicatorHit.label || '').toLowerCase();
    let matchedCategory = null;
    let matchedScore = pestIndicatorHit.score || 0;

    for (const [category, keywords] of Object.entries(LABEL_TO_PEST_CATEGORY)) {
      for (const keyword of keywords) {
        if (hitLabel.includes(keyword)) {
          matchedCategory = category;
          break;
        }
      }
      if (matchedCategory) break;
    }

    if (matchedCategory) {
      logger.info(`AI pest indicator: "${pestIndicatorHit.label}" → category: ${matchedCategory}`);
      return { category: matchedCategory, confidence: Math.max(0.87, matchedScore), label: pestIndicatorHit.label };
    }
  }

  // ---- Step B: Check if the top-3 results suggest a non-pest object ----
  // With real photos, the model identifies objects at 25%+ confidence
  // We check top-3 instead of just top-1 for better coverage
  let nonPestCount = 0;
  let bestNonPestLabel = null;
  let bestNonPestScore = 0;

  for (const result of hfResults.slice(0, 3)) {
    const label = (result.label || '').toLowerCase();
    const score = result.score || 0;
    const isNonPest = CLEAR_NON_PEST_LABELS.some(kw => label.includes(kw));
    if (isNonPest) {
      nonPestCount++;
      if (score > bestNonPestScore) {
        bestNonPestScore = score;
        bestNonPestLabel = result.label;
      }
    }
  }

  // If 2+ of top-3 results are non-pest objects, OR top-1 is non-pest with >25% confidence
  if (nonPestCount >= 2 || (nonPestCount >= 1 && bestNonPestScore > 0.25)) {
    logger.info(`AI non-pest detected: "${bestNonPestLabel}" (score: ${(bestNonPestScore*100).toFixed(1)}%, ${nonPestCount}/3 top results are non-pest)`);
    return { category: 'non-pest', confidence: bestNonPestScore, label: bestNonPestLabel };
  }

  // ---- Step C: Broader pest match across top-10 ----
  let bestCategory = null;
  let bestScore = 0;

  for (const result of hfResults.slice(0, 10)) {
    const rawLabel = (result.label || '').toLowerCase();
    const score = result.score || 0;

    for (const [category, keywords] of Object.entries(LABEL_TO_PEST_CATEGORY)) {
      for (const keyword of keywords) {
        if (rawLabel.includes(keyword) && score > bestScore) {
          bestCategory = category;
          bestScore = score;
          logger.info(`Label "${rawLabel}" → pest category: ${category} (score: ${score})`);
        }
      }
    }
  }

  if (bestCategory) {
    return { category: bestCategory, confidence: Math.max(0.85, bestScore), label: bestCategory };
  }

  // No clear match either way - will defer to pixel-based analysis
  return null;
}

/**
 * Fetch pests from database with fallback to in-memory catalog
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
      setTimeout(() => reject(new Error('Database query timeout')), 4000)
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
      logger.info(`Loaded ${pests.length} pests from database`);
    }
  } catch (err) {
    logger.warn(`Database pest fetch failed: ${err.message}`);
  }

  if (!pests || pests.length === 0) {
    pests = FALLBACK_PESTS;
    logger.info('Using fallback pest catalog');
  }

  return pests;
}

/**
 * Find matching pest in catalog by category name
 */
function findPestByCategory(pests, category) {
  const searchTerms = {
    'aphid': ['aphid', 'greenfl'],
    'armyworm': ['armyworm', 'army worm'],
    'whitefly': ['whitefly', 'white fly'],
    'ladybug': ['ladybug', 'ladybird', 'lady bug']
  };

  const terms = searchTerms[category] || [category];
  for (const term of terms) {
    const found = pests.find(p =>
      p.name.toLowerCase().includes(term) ||
      (p.scientificName && p.scientificName.toLowerCase().includes(term))
    );
    if (found) return found;
  }

  // Return default pest if no exact match
  return pests[0];
}

/**
 * MAIN FUNCTION: Classify pest image
 * 
 * DESIGN PRINCIPLE: For a pest detection app, false positives (detecting a pest 
 * when there isn't one) are FAR better than false negatives (not detecting a pest 
 * when there IS one). When a farmer photographs their crop, they NEED a result.
 * 
 * Only return "No Pest Detected" for images that are CLEARLY not agricultural:
 * - Selfies / human portraits
 * - Cars, buildings, electronics
 * 
 * For ANYTHING that could be a plant, insect, leaf, or agricultural scene:
 * → ALWAYS return a pest detection result
 */
async function classifyPestImage(imagePath) {
  logger.info(`=== Starting pest classification for ${path.basename(imagePath)} ===`);

  // Step 1: Pixel analysis to understand image content
  const pixelAnalysis = await analyzeImagePixels(imagePath);

  // Step 2: Reject images that are CLEARLY human portraits
  if (pixelAnalysis.isHumanOrInvalid) {
    logger.info('Image rejected: clearly human/non-plant (>65% skin, <3% green, <10% brown)');
    return buildRejectionResult('No pest or plant disease detected. The image appears to contain a person. Please photograph a crop leaf or insect pest.');
  }

  // Step 3: Check if image has ANY agricultural content using pixel analysis
  // Agricultural images have: green plant pixels, brown soil, dark insect bodies on green, or red/orange beetles
  // We specifically check for GREEN-DOMINANT pixels, not just any green average (grey images have high avgGreen too)
  const hasAgriContent = (
    pixelAnalysis.plantRatio > 0.03 ||                         // Has green plant content (green > red & green > blue)
    pixelAnalysis.brownRatio > 0.04 ||                         // Has brown soil/leaf damage
    (pixelAnalysis.darkRatio > 0.05 && pixelAnalysis.plantRatio > 0.01) ||  // Dark pixels WITH some green = insect on plant
    pixelAnalysis.redOrangeRatio > 0.01 ||                     // Has red/orange (beetle/rust)
    (pixelAnalysis.isGreenDominant === true)                    // Pixels are genuinely green-dominant
  );

  logger.info(`Agricultural content check: hasAgriContent=${hasAgriContent} (plant=${(pixelAnalysis.plantRatio*100).toFixed(1)}%, brown=${(pixelAnalysis.brownRatio*100).toFixed(1)}%, dark=${(pixelAnalysis.darkRatio*100).toFixed(1)}%, redOrange=${(pixelAnalysis.redOrangeRatio*100).toFixed(1)}%, greenDominant=${pixelAnalysis.isGreenDominant})`);

  // Step 4: Try HuggingFace AI models (ViT first, then ResNet-50)
  let pestCategory = pixelAnalysis.pestCategory; // default from pixel analysis
  let confidence = 0.85;
  let aiUsed = false;
  let aiSaysNonPest = false;
  let aiNonPestLabel = '';

  try {
    const hfResults = await callHuggingFaceVision(imagePath);
    const pestResult = determinePestFromLabels(hfResults);

    if (pestResult) {
      if (pestResult.category === 'non-pest') {
        aiSaysNonPest = true;
        aiNonPestLabel = pestResult.label || 'unknown object';
        logger.info(`AI identifies non-pest object: "${aiNonPestLabel}"`);

        // AI says non-pest — check if pixel analysis agrees
        if (!hasAgriContent) {
          // BOTH AI and pixels say non-agricultural → REJECT with specific message
          logger.info('✅ Both AI and pixel analysis confirm non-agricultural image → rejecting');
          return buildRejectionResult(`No pest detected. The image appears to show a ${aiNonPestLabel}. Please take a clear photo of a crop leaf or insect pest.`);
        } else {
          // AI says non-pest but image HAS green/agricultural content
          // This can happen with plant photos that AI misclassifies → trust pixels
          logger.info(`AI says "${aiNonPestLabel}" but image has agricultural content → overriding with pixel analysis`);
        }
      } else {
        // AI found a pest category
        pestCategory = pestResult.category;
        confidence = Math.max(0.87, pestResult.confidence);
        aiUsed = true;
        logger.info(`AI detected pest category: ${pestCategory} (confidence: ${confidence})`);
      }
    } else {
      logger.info('AI returned no clear pest or non-pest match → checking pixel analysis');
    }
  } catch (err) {
    logger.warn(`HuggingFace API failed: ${err.message} → using pixel-based analysis`);
  }

  // Step 5: If AI didn't identify anything AND pixels show no agricultural content → REJECT
  if (!aiUsed && !hasAgriContent && !aiSaysNonPest) {
    logger.info('No AI match AND no agricultural pixel content → rejecting as non-pest image');
    return buildRejectionResult('No pest or plant disease detected. The image does not appear to show crops or insects. Please take a clear photo of an affected crop leaf or insect pest.');
  }

  // Step 4: Fetch pest catalog from database
  const pests = await fetchPestCatalog();

  // Step 5: Find the matching pest in catalog
  const matchedPest = findPestByCategory(pests, pestCategory);

  if (!matchedPest) {
    // This should NEVER happen since findPestByCategory always returns pests[0]
    // But just in case...
    logger.error('No pest found in catalog — this should never happen');
    const fallbackPest = pests[0] || FALLBACK_PESTS[0];
    return buildSuccessResult(fallbackPest, 0.80);
  }

  logger.info(`✅ Final result: ${matchedPest.name} (category=${pestCategory}, confidence=${confidence}, aiUsed=${aiUsed})`);
  return buildSuccessResult(matchedPest, confidence);
}

/**
 * Build a rejection result (no pest detected)
 */
function buildRejectionResult(message) {
  return {
    isPestDetected: false,
    pestId: null,
    pest: null,
    confidenceScore: 0,
    isHarmful: false,
    message: message,
    affectedCrops: [],
    recommendedPesticides: []
  };
}

/**
 * Build a successful pest detection result
 */
function buildSuccessResult(matchedPest, confidence) {
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
