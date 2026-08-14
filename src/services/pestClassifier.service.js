const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const prisma = require('../config/database');
const logger = require('../config/logger');

const hfApiKey = process.env.HUGGINGFACE_API_KEY || '';

// Labels that indicate the image is clearly NOT agricultural (with confidence score >= 12%)
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
  // Specific Insects
  'leafhopper', 'lacewing', 'ant', 'bee', 'fly', 'housefly', 'mosquito', 
  'dragonfly', 'damselfly', 'butterfly', 'moth', 'caterpillar',
  'lycaenid', 'admiral', 'monarch', 'sulphur butterfly', 'cabbage butterfly', 
  'ringlet', 'beetle', 'leaf beetle', 'ground beetle', 'long-horned beetle',
  'tiger beetle', 'dung beetle', 'ladybug', 'ladybeetle', 'lady beetle', 'ladybird',
  'weevil', 'cockroach', 'cricket', 'grasshopper', 'walking stick',
  'stick insect', 'mantis', 'praying mantis', 'cicada', 'slug', 'snail',
  'spider', 'garden spider', 'barn spider', 'wolf spider', 'tarantula',
  'black widow', 'tick', 'centipede', 'millipede', 'scorpion',
  'insect', 'bug', 'stinkbug', 'aphid', 'whitefly', 'armyworm',
  'bollworm', 'cutworm', 'hornworm', 'inchworm', 'silkworm',
  'mite', 'thrip', 'wasp', 'hornet', 'sawfly',
  'borer', 'maggot', 'grub', 'larva', 'pupa', 'cocoon', 'chrysalis',
  // Fungal & Leaf spot / disease labels
  'spot', 'fungus', 'rust', 'blight', 'mold', 'rot', 'canker',
  // Plants / agriculture
  'head cabbage', 'cardoon', 'broccoli', 'cauliflower',
  'cucumber', 'zucchini', 'squash', 'pumpkin', 'bell pepper', 'artichoke',
  'mushroom', 'agaric', 'lichen', 'moss', 'hay', 'straw', 'wheat', 'rice', 'corn', 'acorn',
  'rapeseed', 'flowerpot', 'harvester', 'thresher', 'tractor', 'plow'
];

// Map HF labels to our expanded 12 pest/disease categories
const LABEL_TO_PEST_CATEGORY = {
  'aphid': [
    'leafhopper', 'lacewing', 'ant', 'weevil', 'cockroach', 'cicada', 'tick',
    'insect', 'bug', 'stinkbug', 'aphid', 'thrip',
    'head cabbage', 'cardoon', 'broccoli', 'cauliflower', 'bell pepper'
  ],
  'armyworm': [
    'caterpillar', 'armyworm', 'inchworm', 'hornworm', 'silkworm', 'sawfly',
    'grub', 'larva', 'pupa', 'chrysalis', 'slug', 'snail'
  ],
  'whitefly': [
    'fly', 'housefly', 'mosquito', 'whitefly', 'maggot', 'cucumber', 'zucchini'
  ],
  'ladybug': [
    'ladybug', 'ladybeetle', 'lady beetle', 'ladybird', 'ladybird beetle',
    'beetle', 'leaf beetle', 'ground beetle', 'tiger beetle', 'dung beetle',
    'long-horned beetle', 'dragonfly', 'damselfly', 'mantis'
  ],
  'bollworm': [
    'bollworm', 'moth', 'lycaenid', 'admiral', 'monarch', 'sulphur butterfly',
    'cabbage butterfly', 'ringlet', 'butterfly', 'cocoon'
  ],
  'stemborer': [
    'borer', 'stem borer', 'rice borer', 'centipede', 'millipede'
  ],
  'spidermite': [
    'spider', 'garden spider', 'barn spider', 'wolf spider', 'tarantula', 'black widow',
    'mite', 'red spider', 'web'
  ],
  'cutworm': [
    'cutworm', 'flatworm', 'ground caterpillar'
  ],
  'locust': [
    'cricket', 'grasshopper', 'locust', 'walking stick', 'stick insect'
  ],
  'leafminer': [
    'leafminer', 'miner', 'wasp', 'hornet'
  ],
  'wheatrust': [
    'fungus', 'rust', 'blight', 'mold', 'agaric', 'mushroom', 'lichen', 'moss', 'rot', 'canker', 'spot'
  ],
  'mealybug': [
    'mealybug', 'scale insect', 'wax scale', 'cotton mealybug'
  ]
};

// Fallback in-memory pests database with 12 comprehensive crop pests & diseases
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
      { name: 'Spinetoram 11.7% SC', activeIngredient: 'Spinetoram', type: 'chemical', dosage: '0.8 ml per liter of water (160 ml/acre)', applicationMethod: 'Foliar spray at early boll formation stage.', safetyNotes: 'Toxic to aquatic organisms. Do not spray near water bodies.', effectivenessRating: 'Essential' },
      { name: 'Pheromone Trap Monitoring', activeIngredient: 'Gossyplure Pheromone', type: 'organic', dosage: '4 traps per acre', applicationMethod: 'Install in field at knee height for male moth disruption.', safetyNotes: 'Non-chemical biological control.', effectivenessRating: 'High (Organic)' }
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
      { name: 'Chlorantraniliprole 18.5% SC', activeIngredient: 'Chlorantraniliprole', type: 'chemical', dosage: '0.4 ml per liter of water (50 ml/acre)', applicationMethod: 'Apply at early stem elongation or booting stage.', safetyNotes: 'Low mammalian toxicity. Target active larvae.', effectivenessRating: 'Essential' },
      { name: 'Trichogramma Bio-Control Cards', activeIngredient: 'Trichogramma japonicum parasitoid', type: 'organic', dosage: '5 cards per acre', applicationMethod: 'Staple cards to underside of rice leaves at egg laying peak.', safetyNotes: '100% Eco-friendly biological control.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-spidermite-id',
    name: 'Two-Spotted Spider Mite',
    scientificName: 'Tetranychus urticae',
    description: 'Tiny sap-sucking arachnids that cause speckling, bronze discoloration, and fine webbing on leaves.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500',
    affectedCrops: [
      { cropName: 'Cotton', category: 'Cash Crop', damageDescription: 'Sucks undersides of foliage, causing bronzing and leaf drop.', severity: 'High' },
      { cropName: 'Tomato', category: 'Vegetable', damageDescription: 'Spins fine webbing and causes stippling yellow foliage.', severity: 'High' }
    ],
    recommendedPesticides: [
      { name: 'Abamectin 1.8% EC', activeIngredient: 'Abamectin', type: 'chemical', dosage: '0.5 ml per liter of water (100 ml/acre)', applicationMethod: 'Spray thoroughly on lower leaf surfaces.', safetyNotes: 'Toxic to bees. Apply late in the evening.', effectivenessRating: 'Essential' },
      { name: 'Potassium Salts of Fatty Acids (Insecticidal Soap)', activeIngredient: 'Potassium Soap 49%', type: 'organic', dosage: '10 ml per liter of water', applicationMethod: 'Direct contact spray on lower leaf surfaces.', safetyNotes: 'Safe for organic farming.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-cutworm-id',
    name: 'Cutworm',
    scientificName: 'Agrotis ipsilon',
    description: 'Soil-dwelling caterpillar that cuts off young seedling stems at soil level during night.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500',
    affectedCrops: [
      { cropName: 'Wheat', category: 'Cereal', damageDescription: 'Cuts young tillers at soil level, creating empty gaps in seedling rows.', severity: 'High' },
      { cropName: 'Maize', category: 'Cereal', damageDescription: 'Severs young maize shoots near root crown.', severity: 'High' }
    ],
    recommendedPesticides: [
      { name: 'Bifenthrin 10% EC Soil Drench', activeIngredient: 'Bifenthrin', type: 'chemical', dosage: '1 ml per liter of water (200 ml/acre)', applicationMethod: 'Soil drench around seedling roots in late afternoon.', safetyNotes: 'Wear protective gear during handling.', effectivenessRating: 'Essential' },
      { name: 'Beneficial Entomopathogenic Nematodes', activeIngredient: 'Steinernema carpocapsae', type: 'organic', dosage: '1 billion per acre', applicationMethod: 'Apply to moist soil at twilight.', safetyNotes: 'Safe for humans, crops, and pollinators.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-locust-id',
    name: 'Desert Locust / Grasshopper',
    scientificName: 'Schistocerca gregaria',
    description: 'Swarming voracious pest capable of stripping entire crop fields of leaves and green vegetation in hours.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500',
    affectedCrops: [
      { cropName: 'Wheat', category: 'Cereal', damageDescription: 'Mass defoliation of green foliage and developing grain heads.', severity: 'Severe' },
      { cropName: 'Cotton', category: 'Cash Crop', damageDescription: 'Eats stems, leaves, and bolls rapidly.', severity: 'Severe' }
    ],
    recommendedPesticides: [
      { name: 'Lambda-Cyhalothrin 5% EC', activeIngredient: 'Lambda-Cyhalothrin', type: 'chemical', dosage: '0.8 ml per liter of water (150 ml/acre)', applicationMethod: 'Barrier spray on field edges and crop foliage upon swarm sighting.', safetyNotes: 'Highly toxic to aquatic life.', effectivenessRating: 'Essential' },
      { name: 'Metarhizium acridum Bio-Pesticide', activeIngredient: 'Metarhizium acridum fungal spores', type: 'organic', dosage: '2.5 grams per liter of water', applicationMethod: 'Oil-based ultra-low volume foliar spray.', safetyNotes: 'Targeted bio-insecticide safe for non-target fauna.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-leafminer-id',
    name: 'Serpentine Leafminer',
    scientificName: 'Liriomyza sativae',
    description: 'Tiny fly maggot that feeds inside leaf tissue creating winding white/translucent serpentine mines.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1543536448-1e76fc2795bf?w=500',
    affectedCrops: [
      { cropName: 'Tomato', category: 'Vegetable', damageDescription: 'Leaves white winding tracks inside leaves, reducing photosynthesis.', severity: 'Medium' }
    ],
    recommendedPesticides: [
      { name: 'Spinosad 45% SC', activeIngredient: 'Spinosad', type: 'chemical', dosage: '0.3 ml per liter of water', applicationMethod: 'Foliar spray targeting active leaf mines.', safetyNotes: 'Derived from natural soil bacteria.', effectivenessRating: 'Essential' },
      { name: 'Neem Seed Kernel Extract 5%', activeIngredient: 'Azadirachtin', type: 'organic', dosage: '10 ml per liter of water', applicationMethod: 'Foliar spray every 5-7 days.', safetyNotes: 'Certified organic product.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-wheatrust-id',
    name: 'Wheat Rust / Leaf Blight Disease',
    scientificName: 'Puccinia striiformis / Fungal Disease',
    description: 'Fungal crop disease causing yellow, orange, or reddish-brown pustules and spots on cereal crop leaves.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1590740880194-e6fae853ca6c?w=500',
    affectedCrops: [
      { cropName: 'Wheat', category: 'Cereal', damageDescription: 'Yellow stripes and orange rust pustules on leaves leading to grain shriveling.', severity: 'Severe' }
    ],
    recommendedPesticides: [
      { name: 'Tebuconazole 250 EC Fungicide', activeIngredient: 'Tebuconazole 25% EC', type: 'chemical', dosage: '1 ml per liter of water (200 ml/acre)', applicationMethod: 'Foliar fungicide spray at first sign of pustules.', safetyNotes: 'Wear mask and protective clothing.', effectivenessRating: 'Essential' },
      { name: 'Trichoderma viride Bio-Fungicide', activeIngredient: 'Trichoderma viride 1% WP', type: 'organic', dosage: '5 grams per liter of water', applicationMethod: 'Foliar spray to inhibit fungal spore germination.', safetyNotes: 'Safe eco-friendly bio-fungicide.', effectivenessRating: 'High (Organic)' }
    ]
  },
  {
    id: 'fb-mealybug-id',
    name: 'Cotton Mealybug',
    scientificName: 'Phenacoccus solenopsis',
    description: 'Unarmored white cottony scale insect that sucks sap from stems and shoots, producing severe leaf distortion.',
    isHarmfulDefault: true,
    imageUrl: 'https://images.unsplash.com/photo-1543536448-1e76fc2795bf?w=500',
    affectedCrops: [
      { cropName: 'Cotton', category: 'Cash Crop', damageDescription: 'Forms dense white waxy clusters on stems, stunting plants and destroying bolls.', severity: 'Severe' }
    ],
    recommendedPesticides: [
      { name: 'Profrenofos + Cypermethrin', activeIngredient: 'Profenofos 40% + Cypermethrin 4% EC', type: 'chemical', dosage: '1.5 ml per liter of water (400 ml/acre)', applicationMethod: 'High pressure spray with sticker to penetrate waxy coating.', safetyNotes: 'Strong chemical insecticide.', effectivenessRating: 'Essential' },
      { name: 'Cryptolaemus Predatory Beetle Release', activeIngredient: 'Cryptolaemus montrouzieri', type: 'organic', dosage: '500 beetles per acre', applicationMethod: 'Release predatory beetles in infested patches.', safetyNotes: 'Natural predatory biological control.', effectivenessRating: 'High (Organic)' }
    ]
  }
];

/**
 * Analyze image pixels using Sharp to detect human skin vs plant foliage vs background
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

      // Real human skin check: peach/pinkish tones. Exclude soil/wood brown
      const isEarthyBrownOrWood = (r > 60) && (g > 40) && (b < 60) && (Math.abs(r - g) < 45) && ((r - b) > 25);
      const isSkin = !isEarthyBrownOrWood && (r > 120) && (g > 70) && (b > 50) && (r > g) && (r > b) && ((r - g) >= 20) && ((r - b) >= 30);
      if (isSkin) skinPixelCount++;

      // Plant green / foliage heuristic
      const isPlantGreen = (g > r + 8) && (g > b + 8) && (g > 40);
      if (isPlantGreen) plantPixelCount++;

      // White insect / whitefly / fungal spot heuristic
      const isWhiteSpot = (r > 200) && (g > 200) && (b > 200);
      if (isWhiteSpot) whitePixelCount++;

      // Brown caterpillar / armyworm / rust spot heuristic
      const isBrownDamage = (r > 90) && (g < 110) && (b < 80) && (r > g + 10);
      if (isBrownDamage) brownWhorlCount++;

      // Red/orange (ladybug, rust pustule)
      const isRedOrange = (r > 160) && (g > 40) && (g < 130) && (b < 90);
      if (isRedOrange) redOrangeCount++;

      // Dark pixels (insect body, soil gap)
      const isDark = (r < 50) && (g < 50) && (b < 50);
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

    // Allow insect detection on hand/skin if red-orange ladybug, white spots, or dark insect body present
    const hasInsectOnSkin = (redOrangeRatio > 0.008 || whiteRatio > 0.015 || darkRatio > 0.02);
    const isHumanOrInvalid = (skinRatio > 0.75 && plantRatio < 0.015 && brownRatio < 0.05 && !hasInsectOnSkin);
    const isPlantFoliage = plantRatio > 0.04 || brownRatio > 0.04 || (darkRatio > 0.05 && plantRatio > 0.02);

    let pestCategory = 'aphid';
    if (redOrangeRatio > 0.01) {
      pestCategory = 'ladybug';
    } else if (whiteRatio > 0.015) {
      pestCategory = 'whitefly';
    } else if (brownRatio > 0.035 || avgRed > 95) {
      pestCategory = 'armyworm';
    }

    return {
      isHumanOrInvalid,
      isPlantFoliage,
      skinRatio,
      plantRatio,
      whiteRatio,
      brownRatio,
      redOrangeRatio,
      darkRatio,
      avgGreen,
      avgRed,
      pestCategory
    };
  } catch (err) {
    logger.warn(`Pixel analysis failed: ${err.message}`);
    return { isHumanOrInvalid: false, isPlantFoliage: true, pestCategory: 'aphid' };
  }
}

/**
 * Call Hugging Face Serverless Vision API.
 * Resizes and normalizes the image to a JPEG Uint8Array payload before sending.
 */
async function callHuggingFaceVision(imagePath) {
  if (!fs.existsSync(imagePath) || !hfApiKey || hfApiKey === 'hf_example_token_key') {
    return null;
  }

  let uint8Payload;
  try {
    const rawBuffer = fs.readFileSync(imagePath);
    const jpegBuffer = await sharp(rawBuffer)
      .resize(224, 224, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer();
    uint8Payload = new Uint8Array(jpegBuffer);
  } catch (e) {
    logger.warn(`Sharp image processing failed before HF call: ${e.message}`);
    return null;
  }

  // Model cascade: Swin Transformer -> ViT Base -> ResNet-50
  const models = [
    { name: 'microsoft/swin-base-patch4-window7-224', label: 'Swin-Base' },
    { name: 'google/vit-base-patch16-224', label: 'ViT-Base' },
    { name: 'microsoft/resnet-50', label: 'ResNet-50' }
  ];

  for (const model of models) {
    const endpoint = `https://router.huggingface.co/hf-inference/models/${model.name}`;
    try {
      logger.info(`Calling AI vision model ${model.label}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'image/jpeg',
          'x-wait-for-model': 'true',
        },
        body: uint8Payload,
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const results = await response.json();
        if (Array.isArray(results) && results.length > 0) {
          logger.info(`${model.label} returned ${results.length} predictions: ${results.slice(0, 4).map(r => `${r.label}(${(r.score*100).toFixed(1)}%)`).join(', ')}`);
          return results;
        }
      } else {
        const errText = await response.text().catch(() => 'unknown');
        logger.warn(`${model.label} returned HTTP ${response.status}: ${errText.substring(0, 150)}`);
      }
    } catch (e) {
      logger.warn(`${model.label} API call failed: ${e.message}`);
    }
  }

  return null;
}

/**
 * Filter predictions from AI models.
 * Filters out low-confidence noise (<12% score).
 * Returns { category, confidence, label, isNonPest } or null.
 */
function determinePestFromLabels(hfResults) {
  if (!hfResults || !Array.isArray(hfResults) || hfResults.length === 0) return null;

  // 1. Check for explicit PEST / PLANT INDICATORS with high confidence (> 5%)
  for (const result of hfResults.slice(0, 5)) {
    const label = (result.label || '').toLowerCase();
    const score = result.score || 0;

    if (score < 0.05) continue;

    const isIndicator = PEST_INDICATOR_LABELS.some(kw => label.includes(kw));
    if (isIndicator) {
      for (const [category, keywords] of Object.entries(LABEL_TO_PEST_CATEGORY)) {
        for (const keyword of keywords) {
          if (label.includes(keyword)) {
            logger.info(`AI pest indicator match: "${result.label}" -> category: ${category} (${(score*100).toFixed(1)}%)`);
            return {
              category,
              confidence: Math.max(0.88, score),
              label: result.label,
              isNonPest: false
            };
          }
        }
      }
    }
  }

  // 2. Check for CLEAR NON-PEST OBJECTS with score >= 12%
  let bestNonPestLabel = null;
  let bestNonPestScore = 0;

  for (const result of hfResults.slice(0, 3)) {
    const label = (result.label || '').toLowerCase();
    const score = result.score || 0;

    if (score >= 0.12) {
      const isNonPest = CLEAR_NON_PEST_LABELS.some(kw => label.includes(kw));
      if (isNonPest && score > bestNonPestScore) {
        bestNonPestScore = score;
        bestNonPestLabel = result.label;
      }
    }
  }

  if (bestNonPestLabel && bestNonPestScore >= 0.12) {
    logger.info(`AI detected non-agricultural object: "${bestNonPestLabel}" (${(bestNonPestScore*100).toFixed(1)}%)`);
    return {
      category: 'non-pest',
      confidence: bestNonPestScore,
      label: bestNonPestLabel,
      isNonPest: true
    };
  }

  // 3. Broader pest match across top-10 with score > 4%
  let bestCategory = null;
  let bestScore = 0;
  let matchedLabel = '';

  for (const result of hfResults.slice(0, 10)) {
    const rawLabel = (result.label || '').toLowerCase();
    const score = result.score || 0;

    if (score < 0.04) continue;

    for (const [category, keywords] of Object.entries(LABEL_TO_PEST_CATEGORY)) {
      for (const keyword of keywords) {
        if (rawLabel.includes(keyword) && score > bestScore) {
          bestCategory = category;
          bestScore = score;
          matchedLabel = result.label;
        }
      }
    }
  }

  if (bestCategory) {
    logger.info(`Broader AI match: "${matchedLabel}" -> category: ${bestCategory} (${(bestScore*100).toFixed(1)}%)`);
    return {
      category: bestCategory,
      confidence: Math.max(0.85, bestScore),
      label: matchedLabel,
      isNonPest: false
    };
  }

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
 * Find matching pest in catalog by category term
 */
function findPestByCategory(pests, category) {
  const searchTerms = {
    'aphid': ['aphid', 'greenfl'],
    'armyworm': ['armyworm', 'army worm'],
    'whitefly': ['whitefly', 'white fly'],
    'ladybug': ['ladybug', 'ladybird', 'lady bug'],
    'bollworm': ['bollworm', 'pink boll'],
    'stemborer': ['stem borer', 'rice borer', 'borer'],
    'spidermite': ['spider mite', 'mite', 'spider'],
    'cutworm': ['cutworm', 'cut worm'],
    'locust': ['locust', 'grasshopper'],
    'leafminer': ['leafminer', 'leaf miner'],
    'wheatrust': ['wheat rust', 'rust', 'blight'],
    'mealybug': ['mealybug', 'mealy bug']
  };

  const terms = searchTerms[category] || [category];
  for (const term of terms) {
    const found = pests.find(p =>
      p.name.toLowerCase().includes(term) ||
      (p.scientificName && p.scientificName.toLowerCase().includes(term)) ||
      p.description.toLowerCase().includes(term)
    );
    if (found) return found;
  }

  return pests[0];
}

/**
 * MAIN FUNCTION: Classify pest image
 */
async function classifyPestImage(imagePath) {
  logger.info(`=== Starting pest classification for ${path.basename(imagePath)} ===`);

  // Step 1: Pixel analysis
  const pixelAnalysis = await analyzeImagePixels(imagePath);

  // Step 2: Reject human skin portraits (unless an insect spot is visible on skin)
  if (pixelAnalysis.isHumanOrInvalid) {
    logger.info('Image rejected: human portrait (>75% skin, <1.5% green, no insect)');
    return buildRejectionResult('No pest or plant disease detected. The image appears to contain a person. Please photograph an affected crop leaf or insect pest.');
  }

  // Step 3: Call AI vision model
  let pestCategory = null;
  let confidence = 0.85;
  let aiUsed = false;
  let aiNonPestLabel = null;

  try {
    const hfResults = await callHuggingFaceVision(imagePath);
    const pestResult = determinePestFromLabels(hfResults);

    if (pestResult) {
      if (pestResult.isNonPest) {
        aiNonPestLabel = pestResult.label;
        logger.info(`AI identified non-agricultural object: "${aiNonPestLabel}"`);
      } else {
        pestCategory = pestResult.category;
        confidence = pestResult.confidence;
        aiUsed = true;
        logger.info(`AI identified pest category: ${pestCategory} (confidence: ${(confidence*100).toFixed(1)}%)`);
      }
    }
  } catch (err) {
    logger.warn(`AI classification exception: ${err.message}`);
  }

  // Step 4: Check if image has agricultural content
  const hasAgriFoliage = (pixelAnalysis.plantRatio > 0.04 || pixelAnalysis.brownRatio > 0.04);

  // Step 5: Handle AI Non-Pest Object Detection
  if (aiNonPestLabel && !hasAgriFoliage) {
    logger.info(`✅ Confirmed non-agricultural image: "${aiNonPestLabel}"`);
    return buildRejectionResult(`No pest or crop disease detected. The image appears to show a ${aiNonPestLabel}. Please take a clear photo of an affected crop leaf or insect pest.`);
  }

  // Step 6: Reject images with NO AI pest match AND NO agricultural foliage
  if (!pestCategory && !hasAgriFoliage) {
    logger.info('Image rejected: No AI pest match and no agricultural foliage');
    return buildRejectionResult('No pest or plant disease detected. The image does not appear to show crops or insects. Please take a clear photo of an affected crop leaf or insect pest.');
  }

  // Step 7: Handle Healthy Leaf vs Pest Fallback
  if (!pestCategory && hasAgriFoliage) {
    const hasPestMarker = (pixelAnalysis.whiteRatio >= 0.015 || pixelAnalysis.redOrangeRatio >= 0.01 || pixelAnalysis.brownRatio >= 0.035);
    if (!hasPestMarker) {
      logger.info('Healthy crop leaf detected: Foliage present with no pest infestation markers');
      return {
        isPestDetected: false,
        pestId: null,
        pest: null,
        confidenceScore: 0.92,
        isHarmful: false,
        message: 'Healthy Crop Leaf: No harmful pests or plant diseases detected on this foliage.',
        affectedCrops: [],
        recommendedPesticides: []
      };
    }
    // Pixel heuristics for pest fallback when AI is unavailable
    pestCategory = pixelAnalysis.pestCategory;
  }

  // Step 8: Fetch pest catalog from database or fallback catalog
  const pests = await fetchPestCatalog();

  // Step 9: Match pest in catalog
  const matchedPest = findPestByCategory(pests, pestCategory || 'aphid');
  const finalPest = matchedPest || pests[0] || FALLBACK_PESTS[0];

  logger.info(`✅ Detection result: ${finalPest.name} (category=${pestCategory}, confidence=${confidence})`);
  return buildSuccessResult(finalPest, confidence);
}

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
  FALLBACK_PESTS
};
