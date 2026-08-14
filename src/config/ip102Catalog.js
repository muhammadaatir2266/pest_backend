/**
 * IP102 Agricultural Pest Catalog & Metadata Dictionary
 * Maps all 102 IP102 dataset classes to detailed pest information, affected crops, and treatment plans.
 */

const IP102_SPECIES_MAP = {
  0: {
    name: "Rice Leaf Roller",
    scientificName: "Cnaphalocrocis medinalis",
    description: "Caterpillars fold rice leaves longitudinally and feed inside, producing translucent white streaks and reducing photosynthesis.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Folds leaves into tubes and consumes leaf tissue, reducing grain filling.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorantraniliprole 18.5% SC", activeIngredient: "Chlorantraniliprole", type: "chemical", dosage: "0.4 ml/L (50 ml/acre)", applicationMethod: "Foliar spray at early leaf-folding stage.", safetyNotes: "Low toxicity to mammals.", effectivenessRating: "Essential" },
      { name: "Neem Oil 0.15% EC", activeIngredient: "Azadirachtin", type: "organic", dosage: "5 ml/L", applicationMethod: "Spray weekly on crop leaves.", safetyNotes: "Safe for beneficial insects.", effectivenessRating: "High (Organic)" }
    ]
  },
  1: {
    name: "Rice Leaf Caterpillar",
    scientificName: "Naranga aenescens",
    description: "Green caterpillars that feed on rice leaves, leaving notched margins and skeletonized foliage.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Feeds on rice blade margins during tillering stage.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Emamectin Benzoate 5% SG", activeIngredient: "Emamectin Benzoate", type: "chemical", dosage: "0.4 g/L (80g/acre)", applicationMethod: "Foliar spray at first sign of leaf damage.", safetyNotes: "Wear protective gear.", effectivenessRating: "Essential" }
    ]
  },
  2: {
    name: "Paddy Stem Maggot",
    scientificName: "Hydrellia philippina",
    description: "Fly larvae that bore into rice leaf sheaths and central whorls, causing damaged margins and withered leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Maggots mine central leaf sheaths of young seedlings.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Cartap Hydrochloride 4G", activeIngredient: "Cartap Hydrochloride", type: "chemical", dosage: "10 kg/acre", applicationMethod: "Broadcast in shallow standing water.", safetyNotes: "Toxic to fish.", effectivenessRating: "Essential" }
    ]
  },
  3: {
    name: "Asiatic Rice Borer (Stem Borer)",
    scientificName: "Chilo suppressalis",
    description: "Severe stem boring pest causing 'dead hearts' in vegetative tillers and 'white heads' during flowering.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Larvae bore into rice stalks, causing stem collapse and empty white heads.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Chlorantraniliprole 0.4% GR", activeIngredient: "Chlorantraniliprole", type: "chemical", dosage: "4 kg/acre", applicationMethod: "Broadcast application with irrigation water.", safetyNotes: "Safe for non-target organisms.", effectivenessRating: "Essential" }
    ]
  },
  4: {
    name: "Yellow Rice Borer",
    scientificName: "Scirpophaga incertulas",
    description: "Monophagous pest of rice causing widespread dead heart tillers and hollow white panicles.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Bores into stem bases, cutting off nutrient transport.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Flubendiamide 480 SC", activeIngredient: "Flubendiamide", type: "chemical", dosage: "0.2 ml/L (50 ml/acre)", applicationMethod: "Foliar spray during peak moth flight.", safetyNotes: "Do not apply near water bodies.", effectivenessRating: "Essential" }
    ]
  },
  5: {
    name: "Rice Gall Midge",
    scientificName: "Orseolia oryzae",
    description: "Small fly whose larvae feed inside rice growing tips, causing shoots to transform into tubular 'onion-leaf' galls.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Gall formation prevents normal panicle emergence.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Fipronil 0.3% GR", activeIngredient: "Fipronil", type: "chemical", dosage: "7 kg/acre", applicationMethod: "Apply to nursery beds or main field 10 days post-transplanting.", safetyNotes: "Toxic to bees.", effectivenessRating: "Essential" }
    ]
  },
  6: {
    name: "Rice Stemfly",
    scientificName: "Chlorops oryzae",
    description: "Small yellow fly larvae that attack rice stems and leaves, causing longitudinal leaf splitting.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Larval mining distorts emerging leaves and panicles.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray upon detecting adult flies.", safetyNotes: "Do not spray during bloom.", effectivenessRating: "Essential" }
    ]
  },
  7: {
    name: "Brown Plant Hopper (BPH)",
    scientificName: "Nilaparvata lugens",
    description: "Major sap-sucking pest that causes 'hopperburn' (browning and drying of entire rice fields) and transmits virus diseases.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Sucks sap from stalk bases, causing rapid field wilting and hopperburn.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Pymetrozine 50% WG", activeIngredient: "Pymetrozine", type: "chemical", dosage: "0.6 g/L (120g/acre)", applicationMethod: "Direct spray towards lower plant stems.", safetyNotes: "Selective sap-sucking inhibitor.", effectivenessRating: "Essential" },
      { name: "Beauveria bassiana Bio-Fungicide", activeIngredient: "Beauveria bassiana", type: "organic", dosage: "5 g/L", applicationMethod: "High volume spray in humid conditions.", safetyNotes: "Organic bio-control agent.", effectivenessRating: "High (Organic)" }
    ]
  },
  8: {
    name: "White-Backed Plant Hopper",
    scientificName: "Sogatella furcifera",
    description: "Sap-sucking insect with a pale white stripe on its thorax, causing yellowing and stunted rice growth.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Sucks tiller sap and secretes honeydew leading to sooty mold.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Dinotefuran 20% SG", activeIngredient: "Dinotefuran", type: "chemical", dosage: "0.4 g/L (80g/acre)", applicationMethod: "Spray plant bases.", safetyNotes: "Rapid systemic knockdown.", effectivenessRating: "Essential" }
    ]
  },
  9: {
    name: "Small Brown Plant Hopper",
    scientificName: "Laodelphax striatellus",
    description: "Vector of Rice Stripe Virus and Black-Streaked Dwarf Virus, feeding on sap of cereal crops.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Transmits destructive viral pathogens to rice and wheat.", severity: "High" },
      { cropName: "Wheat", category: "Cereal", damageDescription: "Vector of wheat rosette virus.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Buprofezin 25% SC", activeIngredient: "Buprofezin", type: "chemical", dosage: "1.5 ml/L", applicationMethod: "Foliar spray to interrupt nymph molting.", safetyNotes: "Insect growth regulator.", effectivenessRating: "Essential" }
    ]
  },
  10: {
    name: "Rice Water Weevil",
    scientificName: "Lissorhoptrus oryzophilus",
    description: "Aquatic weevil whose larvae destroy rice root systems while adults chew scarified lines on leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Larval root pruning reduces tillering, root weight, and yield.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Thiamethoxam 25% WG", activeIngredient: "Thiamethoxam", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Seed treatment or early paddy soil application.", safetyNotes: "Systemic protection.", effectivenessRating: "Essential" }
    ]
  },
  11: {
    name: "Rice Leafhopper",
    scientificName: "Nephotettix cincticeps",
    description: "Green leafhopper sucking sap from rice leaves and transmitting Tungro viral disease.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Sucks leaf sap and transmits rice yellow dwarf and tungro virus.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Wear protective gloves.", effectivenessRating: "Essential" }
    ]
  },
  12: {
    name: "Grain Spreader Thrips (Rice Thrips)",
    scientificName: "Stenchaetothrips biformis",
    description: "Tiny dark insects that scrape leaf tissues, causing leaf tips to roll in and dry up like wire.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Causes leaf rolling, curling, and seedling drying in nurseries.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Spinetoram 11.7% SC", activeIngredient: "Spinetoram", type: "chemical", dosage: "0.8 ml/L", applicationMethod: "Foliar spray at nursery or early tillering.", safetyNotes: "Low impact on predators.", effectivenessRating: "Essential" }
    ]
  },
  13: {
    name: "Rice Shell Pest (Leaf Beetle)",
    scientificName: "Dicladispa armigera",
    description: "Spiny beetle whose larvae mine inside leaf blades creating white blotches, while adults scrape upper epidermis.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice", category: "Grain", damageDescription: "Scrapes leaf surface producing parallel white chlorotic streaks.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 20% EC", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "2 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Use recommended PPE.", effectivenessRating: "Essential" }
    ]
  },
  14: {
    name: "White Grub (Root Pest)",
    scientificName: "Holotrichia serrata",
    description: "Soil-dwelling C-shaped larvae that chew through crop roots, causing sudden plant wilting and death.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Sugarcane", category: "Cash Crop", damageDescription: "Eats main root systems, causing stalk lodge and drying.", severity: "Severe" },
      { cropName: "Groundnut", category: "Oilseed", damageDescription: "Severes taproot system.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Fipronil 40% + Imidacloprid 40% WG", activeIngredient: "Fipronil + Imidacloprid", type: "chemical", dosage: "4 g/10L water", applicationMethod: "Soil drenching around root zones.", safetyNotes: "Target root zones.", effectivenessRating: "Essential" }
    ]
  },
  15: {
    name: "Mole Cricket",
    scientificName: "Gryllotalpa orientalis",
    description: "Subterranean pest with shovel-like front legs that tunnels underground and severs seedling roots and tubers.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Tunnels under seedbeds and severs young taproots.", severity: "Medium" },
      { cropName: "Potato", category: "Tuber", damageDescription: "Bores holes into underground potato tubers.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 10% Granules", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "5 kg/acre", applicationMethod: "Soil incorporation before planting.", safetyNotes: "Avoid exposure to aquatic life.", effectivenessRating: "Essential" }
    ]
  },
  16: {
    name: "Wireworm",
    scientificName: "Agriotes spp.",
    description: "Hard-bodied yellow click beetle larvae that feed on germinating seeds, roots, and potato tubers.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Maize", category: "Cereal", damageDescription: "Destructive seed and root feeding causing missing plant stands.", severity: "High" },
      { cropName: "Potato", category: "Tuber", damageDescription: "Tunnels inside tubers, making them unmarketable.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Bifenthrin 10% EC", activeIngredient: "Bifenthrin", type: "chemical", dosage: "1 ml/L", applicationMethod: "In-furrow soil spray during seeding.", safetyNotes: "Toxic to bees and aquatic organisms.", effectivenessRating: "Essential" }
    ]
  },
  17: {
    name: "White Margined Moth",
    scientificName: "Speiredonia retorta",
    description: "Foliage-feeding moth caterpillar that defoliates fruit trees and legume crops.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Pulses", category: "Legume", damageDescription: "Feeds on leaf tissues during nocturnal larval phase.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Lambda-Cyhalothrin 5% EC", activeIngredient: "Lambda-Cyhalothrin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Late afternoon foliar spray.", safetyNotes: "Synthetic pyrethroid.", effectivenessRating: "Essential" }
    ]
  },
  18: {
    name: "Black Cutworm",
    scientificName: "Agrotis ipsilon",
    description: "Nocturnal caterpillar that cuts young seedling stems at or just below the soil surface.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Maize", category: "Cereal", damageDescription: "Cuts young maize shoots cleanly at soil level.", severity: "Severe" },
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Destroys newly emerged cotton seedlings.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Emamectin Benzoate 5% SG", activeIngredient: "Emamectin Benzoate", type: "chemical", dosage: "0.4 g/L", applicationMethod: "Target seedling base in evening.", safetyNotes: "Apply around root zone.", effectivenessRating: "Essential" }
    ]
  },
  19: {
    name: "Large Cutworm",
    scientificName: "Agrotis tokionis",
    description: "Large soil caterpillar damaging vegetable crops, maize, and sugar beet seedlings by stem cutting.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Vegetables", category: "Vegetable", damageDescription: "Severs cabbage and tomato stems near soil.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 50% + Cypermethrin 5% EC", activeIngredient: "Chlorpyrifos + Cypermethrin", type: "chemical", dosage: "2 ml/L", applicationMethod: "Soil drench around affected seedlings.", safetyNotes: "Strong contact insecticide.", effectivenessRating: "Essential" }
    ]
  },
  20: {
    name: "Yellow Cutworm",
    scientificName: "Agrotis segetum",
    description: "Common turnip moth cutworm larva feeding on roots and stems of root vegetables and cereals.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Feeds on crown roots and young tiller stems.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Indoxacarb 14.5% SC", activeIngredient: "Indoxacarb", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray at dusk.", safetyNotes: "Low avian toxicity.", effectivenessRating: "Essential" }
    ]
  },
  21: {
    name: "Red Spider Mite",
    scientificName: "Tetranychus urticae",
    description: "Tiny arachnid pest that spins webs under leaves, causing stippling, chlorosis, and leaf bronzing.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Causes webbing and severe red bronzing of leaves.", severity: "Severe" },
      { cropName: "Apple", category: "Fruit", damageDescription: "Leaf chlorosis and premature leaf drop.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Spiromesifen 22.9% SC", activeIngredient: "Spiromesifen", type: "chemical", dosage: "1 ml/L (200 ml/acre)", applicationMethod: "Spray underside of leaves thoroughly.", safetyNotes: "Selective miticide.", effectivenessRating: "Essential" },
      { name: "Neem Oil 10,000 PPM", activeIngredient: "Azadirachtin", type: "organic", dosage: "3 ml/L", applicationMethod: "Foliar spray covering lower leaf surfaces.", safetyNotes: "Organic miticide.", effectivenessRating: "High (Organic)" }
    ]
  },
  22: {
    name: "Corn Borer",
    scientificName: "Ostrinia furnacalis",
    description: "Major pest of maize whose larvae bore into stalks and ears, leading to broken tassels and ear rot.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Maize", category: "Cereal", damageDescription: "Tunnels in maize stalks and feeds on developing grain cobs.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Chlorantraniliprole 18.5% SC", activeIngredient: "Chlorantraniliprole", type: "chemical", dosage: "0.4 ml/L", applicationMethod: "Spray whorls and stems at cob initiation.", safetyNotes: "Target central whorl.", effectivenessRating: "Essential" }
    ]
  },
  23: {
    name: "Fall Armyworm / Armyworm",
    scientificName: "Spodoptera frugiperda",
    description: "Highly destructive caterpillar that marches through crop fields consuming leaves, whorls, and grain ears.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Maize", category: "Cereal", damageDescription: "Extensive defoliation and ragged holes in maize whorls.", severity: "Severe" },
      { cropName: "Sorghum", category: "Cereal", damageDescription: "Consumes leaves and young panicles.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Emamectin Benzoate 5% SG", activeIngredient: "Emamectin Benzoate", type: "chemical", dosage: "0.4 g/L (80g/acre)", applicationMethod: "Direct spray into plant whorls.", safetyNotes: "Apply at early instar stage.", effectivenessRating: "Essential" },
      { name: "Bacillus thuringiensis (Bt)", activeIngredient: "Bt Kurstaki", type: "organic", dosage: "2 g/L", applicationMethod: "Foliar spray when young caterpillars emerge.", safetyNotes: "Safe organic bio-insecticide.", effectivenessRating: "High (Organic)" }
    ]
  },
  24: {
    name: "Aphids (Plant Lice)",
    scientificName: "Aphis spp. / Myzus persicae",
    description: "Small soft-bodied sap-sucking insects that curl leaves, stunt plants, and excrete sticky honeydew.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Colonies suck sap from tillers and ears, causing grain shriveling.", severity: "High" },
      { cropName: "Mustard", category: "Oilseed", damageDescription: "Covers inflorescence and seed pods.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Do not spray during bloom.", effectivenessRating: "Essential" },
      { name: "Neem Oil 0.15% EC", activeIngredient: "Azadirachtin", type: "organic", dosage: "5 ml/L", applicationMethod: "Weekly foliar spray.", safetyNotes: "Safe for pollinators.", effectivenessRating: "High (Organic)" }
    ]
  },
  25: {
    name: "Potosia Brevitarsis (Flower Beetle)",
    scientificName: "Protaetia brevitarsis",
    description: "Scarab beetle whose adults feed on crop blossoms and ripening fruit, while larvae live in organic soil.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Maize", category: "Cereal", damageDescription: "Feeds on silk and soft kernels of maize ears.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Cypermethrin 10% EC", activeIngredient: "Cypermethrin", type: "chemical", dosage: "1 ml/L", applicationMethod: "Target adult beetles on ears.", safetyNotes: "Wear mask during application.", effectivenessRating: "Essential" }
    ]
  },
  26: {
    name: "Peach Borer",
    scientificName: "Synanthedon exitiosa",
    description: "Clearwing moth caterpillar that bores into lower trunks of stone fruit trees, extruding gummy frass.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Peach / Plum", category: "Fruit", damageDescription: "Girdles lower trunk beneath bark line.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 50% EC", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "2.5 ml/L", applicationMethod: "Trunk spray application.", safetyNotes: "Do not spray fruit canopy.", effectivenessRating: "Essential" }
    ]
  },
  27: {
    name: "English Grain Aphid",
    scientificName: "Sitobion avenae",
    description: "Major aphid species attacking wheat and barley ears during head emergence and grain filling.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Colonizes wheat ears and sucks grain sap, lowering 1000-grain weight.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Thiamethoxam 25% WG", activeIngredient: "Thiamethoxam", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Spray wheat canopy at flowering stage.", safetyNotes: "Toxic to bees.", effectivenessRating: "Essential" }
    ]
  },
  28: {
    name: "Greenbug (Wheat Aphid)",
    scientificName: "Schizaphis graminum",
    description: "Green aphid that injects toxic saliva while feeding on wheat leaves, causing red/yellow dead spots.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Salivary toxin causes yellow spots that expand into dead necrotic leaf zones.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Acetamiprid 20% SP", activeIngredient: "Acetamiprid", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Systemic translaminar action.", effectivenessRating: "Essential" }
    ]
  },
  29: {
    name: "Bird Cherry-Oat Aphid",
    scientificName: "Rhopalosiphum padi",
    description: "Dark green aphid vector of Barley Yellow Dwarf Virus (BYDV) on wheat, barley, and oat crops.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Transmits Barley Yellow Dwarf Virus, causing leaf yellowing and stunting.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 60% FS (Seed Dresser)", activeIngredient: "Imidacloprid", type: "chemical", dosage: "4 ml/kg seed", applicationMethod: "Systemic seed treatment prior to sowing.", safetyNotes: "Protects early seedlings.", effectivenessRating: "Essential" }
    ]
  },
  30: {
    name: "Wheat Blossom Midge",
    scientificName: "Sitodiplosis mosellana",
    description: "Tiny orange midge fly whose maggots feed on developing wheat kernels inside the glumes.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Larvae feed on developing grains causing shriveled, cracked kernels.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 50% + Cypermethrin 5% EC", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "1.5 ml/L", applicationMethod: "Apply during wheat head emergence at dusk.", safetyNotes: "Target adult midges during egg laying.", effectivenessRating: "Essential" }
    ]
  },
  31: {
    name: "Penthaleus Major (Winter Grain Mite)",
    scientificName: "Penthaleus major",
    description: "Dark blue/black soil mite with reddish legs that feeds on wheat and barley foliage in cold weather.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Silvered, bleached leaf appearance during winter months.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Bifenthrin 10% EC", activeIngredient: "Bifenthrin", type: "chemical", dosage: "1 ml/L", applicationMethod: "Foliar spray when silvering occurs.", safetyNotes: "Synthetic pyrethroid miticide.", effectivenessRating: "Essential" }
    ]
  },
  32: {
    name: "Long-Legged Spider Mite",
    scientificName: "Bryobia praetiosa",
    description: "Mite species with exceptionally long front legs that feeds on grasses, legumes, and wheat.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Causes speckled white stippling on lower leaves.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Propargite 57% EC", activeIngredient: "Propargite", type: "chemical", dosage: "2 ml/L", applicationMethod: "Thorough canopy spray.", safetyNotes: "Contact miticide.", effectivenessRating: "Essential" }
    ]
  },
  33: {
    name: "Wheat Phloeothrips",
    scientificName: "Haplothrips tritici",
    description: "Tiny dark thrips species feeding on wheat ears, causing white panicles and light grain weight.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Feeds inside florets, leading to kernel abortion.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Fipronil 5% SC", activeIngredient: "Fipronil", type: "chemical", dosage: "1 ml/L", applicationMethod: "Foliar spray before head flowering.", safetyNotes: "Highly effective on thrips.", effectivenessRating: "Essential" }
    ]
  },
  34: {
    name: "Wheat Sawfly",
    scientificName: "Cephus cinctus",
    description: "Wasplike insect whose grub bores inside wheat stems and cuts the stem base before harvest.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat", category: "Cereal", damageDescription: "Internal stem tunneling causes stem lodging right before harvest.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Thiamethoxam 25% WG", activeIngredient: "Thiamethoxam", type: "chemical", dosage: "0.3 g/L", applicationMethod: "Systemic foliar spray.", safetyNotes: "Apply prior to stem elongation.", effectivenessRating: "Essential" }
    ]
  },
  35: {
    name: "Cerodonta Denticornis (Leafminer)",
    scientificName: "Cerodontha denticornis",
    description: "Small fly whose larvae mine linear tracks inside grass and cereal leaf blades.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Barley / Wheat", category: "Cereal", damageDescription: "Leaf mines reduce active photosynthetic green area.", severity: "Low" }
    ],
    recommendedPesticides: [
      { name: "Abamectin 1.9% EC", activeIngredient: "Abamectin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Translaminar foliar spray.", safetyNotes: "Penetrates leaf cuticle.", effectivenessRating: "Essential" }
    ]
  },
  36: {
    name: "Beet Fly (Mangold Fly)",
    scientificName: "Pegomya hyoscyami",
    description: "Fly larvae that create large blister-like leaf mines on sugar beet and spinach foliage.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Sugar Beet", category: "Cash Crop", damageDescription: "Blister leaf mines destroy sugar beet foliage.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Dimethoate 30% EC", activeIngredient: "Dimethoate", type: "chemical", dosage: "1.5 ml/L", applicationMethod: "Foliar spray when egg batches appear.", safetyNotes: "Systemic organophosphate.", effectivenessRating: "Essential" }
    ]
  },
  37: {
    name: "Flea Beetle",
    scientificName: "Phyllotreta spp.",
    description: "Tiny jumping beetles that chew numerous small 'shot-hole' perforations in seedling leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cabbage / Mustard", category: "Crucifer", damageDescription: "Shot-hole feeding destroys young cotyledons and leaves.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Thiamethoxam 25% WG", activeIngredient: "Thiamethoxam", type: "chemical", dosage: "0.3 g/L", applicationMethod: "Foliar spray at early seedling stage.", safetyNotes: "Fast systemic action.", effectivenessRating: "Essential" },
      { name: "Diatomaceous Earth Dust", activeIngredient: "Silicon Dioxide", type: "organic", dosage: "Dust foliage", applicationMethod: "Dust dry leaves in morning.", safetyNotes: "Safe physical barrier.", effectivenessRating: "High (Organic)" }
    ]
  },
  38: {
    name: "Cabbage Armyworm",
    scientificName: "Mamestra brassicae",
    description: "Greedy moth caterpillar that skeletonizes cabbage leaves and burrows deep into cabbage heads.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cabbage", category: "Vegetable", damageDescription: "Bores into central cabbage head, depositing wet excrement.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Spinetoram 11.7% SC", activeIngredient: "Spinetoram", type: "chemical", dosage: "0.8 ml/L", applicationMethod: "Target inner canopy.", safetyNotes: "Low impact on non-target species.", effectivenessRating: "Essential" }
    ]
  },
  39: {
    name: "Beet Armyworm",
    scientificName: "Spodoptera exigua",
    description: "Polyphagous caterpillar pest feeding on sugar beets, cotton, onions, and vegetables.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Sugar Beet", category: "Cash Crop", damageDescription: "Consumes beet foliage and crown tops.", severity: "Severe" },
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Skeletonizes young leaves.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Indoxacarb 14.5% SC", activeIngredient: "Indoxacarb", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Spray early instar larvae.", safetyNotes: "Fast feeding cessation.", effectivenessRating: "Essential" }
    ]
  },
  40: {
    name: "Beet Spot Fly",
    scientificName: "Psilopa nitidula",
    description: "Small dark fly causing leaf speckling and spotting on beet leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Sugar Beet", category: "Cash Crop", damageDescription: "Larval feeding produces necrotic leaf spots.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Acetamiprid 20% SP", activeIngredient: "Acetamiprid", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Translaminar control.", effectivenessRating: "Essential" }
    ]
  },
  41: {
    name: "Meadow Moth",
    scientificName: "Loxostege sticticalis",
    description: "Migratory moth caterpillar that forms silk webs on sugar beet and sunflower foliage and defoliates fields.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Sugar Beet", category: "Cash Crop", damageDescription: "Webs foliage and eats entire leaf tissue.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Lambda-Cyhalothrin 5% EC", activeIngredient: "Lambda-Cyhalothrin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Pyrethroid contact spray.", effectivenessRating: "Essential" }
    ]
  },
  42: {
    name: "Beet Weevil",
    scientificName: "Bothynoderes punctiventris",
    description: "Weevil whose adults eat young sugar beet seedlings at emergence and grubs feed on roots.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Sugar Beet", category: "Cash Crop", damageDescription: "Destroys newly germinated beet seedlings.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 70% WS (Seed Treatment)", activeIngredient: "Imidacloprid", type: "chemical", dosage: "10 g/kg seed", applicationMethod: "Seed dressing prior to planting.", safetyNotes: "Long residual seedling protection.", effectivenessRating: "Essential" }
    ]
  },
  43: {
    name: "Serica Orientalis Beetle",
    scientificName: "Serica orientalis",
    description: "Chafing beetle whose subterranean grubs feed on roots of crops and nursery stock.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cereal / Beet", category: "Agricultural", damageDescription: "Root feeding reduces plant anchorage and causes wilting.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 20% EC", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "2 ml/L", applicationMethod: "Soil drenching.", safetyNotes: "Apply to moist soil.", effectivenessRating: "Essential" }
    ]
  },
  44: {
    name: "Alfalfa Weevil",
    scientificName: "Hypera postica",
    description: "Major pest of alfalfa; green larvae skeletonize upper leaves, turning fields white/gray.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Alfalfa", category: "Forage", damageDescription: "Skeletonizes leaves, severely lowering hay quality and yield.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Indoxacarb 14.5% SC", activeIngredient: "Indoxacarb", type: "chemical", dosage: "0.4 ml/L", applicationMethod: "Apply when larval damage reaches 30% stem tips.", safetyNotes: "Harvest safety window: 7 days.", effectivenessRating: "Essential" }
    ]
  },
  45: {
    name: "Flax Budworm",
    scientificName: "Heliothis viriplaca",
    description: "Caterpillar that feeds on flax buds, flowers, and developing seed capsules.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Flax", category: "Oilseed", damageDescription: "Eats developing flower buds and seed pods.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Emamectin Benzoate 5% SG", activeIngredient: "Emamectin Benzoate", type: "chemical", dosage: "0.4 g/L", applicationMethod: "Foliar spray during budding.", safetyNotes: "Target early instars.", effectivenessRating: "Essential" }
    ]
  },
  46: {
    name: "Alfalfa Plant Bug",
    scientificName: "Adelphocoris lineolatus",
    description: "Mirid bug sucking sap from alfalfa flower buds, causing flower blast and seed drop.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Alfalfa", category: "Forage", damageDescription: "Causes bud blasting, flower drop, and shriveled seeds.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Dimethoate 40% EC", activeIngredient: "Dimethoate", type: "chemical", dosage: "1 ml/L", applicationMethod: "Spray prior to flower bloom.", safetyNotes: "Do not apply during full bloom.", effectivenessRating: "Essential" }
    ]
  },
  47: {
    name: "Tarnished Plant Bug",
    scientificName: "Lygus lineolaris",
    description: "Broad-spectrum pest feeding on cotton squares, fruit buds, and legume seed pods.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Causes pinhead square shedding and boll deformity.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Flonicamid 50% WG", activeIngredient: "Flonicamid", type: "chemical", dosage: "0.3 g/L (60g/acre)", applicationMethod: "Foliar spray when square drop is observed.", safetyNotes: "Selective feeding blocker.", effectivenessRating: "Essential" }
    ]
  },
  48: {
    name: "Locustoidea (Locust / Grasshopper)",
    scientificName: "Locusta migratoria",
    description: "Swarming pest that strips foliage from cereal crops, pasture, and trees in hours.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Wheat / Maize", category: "Cereal", damageDescription: "Complete field defoliation by marching or flying swarms.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Malathion 96% ULV", activeIngredient: "Malathion", type: "chemical", dosage: "1 L/hectare ULV", applicationMethod: "Aerial or specialized ULV spray on hopper bands.", safetyNotes: "Community-wide locust control.", effectivenessRating: "Essential" },
      { name: "Metarhizium acridum Bio-Insecticide", activeIngredient: "Metarhizium acridum", type: "organic", dosage: "50 g/hectare", applicationMethod: "Oil-based spray on nymph bands.", safetyNotes: "Locust-specific biological control.", effectivenessRating: "High (Organic)" }
    ]
  },
  49: {
    name: "Lytta Polita (Blister Beetle)",
    scientificName: "Lytta polita",
    description: "Metallic blue/green beetle containing cantharidin toxin that feeds on legume flowers and foliage.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Alfalfa / Legumes", category: "Forage", damageDescription: "Feeds heavily on blossoms and leaves; toxic to livestock if ingested in hay.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Carbaryl 50% WP", activeIngredient: "Carbaryl", type: "chemical", dosage: "2 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Toxic to bees; avoid bloom application.", effectivenessRating: "Essential" }
    ]
  },
  50: {
    name: "Legume Blister Beetle",
    scientificName: "Epicauta gorhami",
    description: "Elongated beetle species that consumes flower petals and leaves of pulse crops.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Soybean / Pulses", category: "Legume", damageDescription: "Consumes reproductive flowers and tender foliage.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Cypermethrin 10% EC", activeIngredient: "Cypermethrin", type: "chemical", dosage: "1 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Wear protective gloves.", effectivenessRating: "Essential" }
    ]
  },
  51: {
    name: "Blister Beetle",
    scientificName: "Epicauta spp.",
    description: "Foliage and flower eating beetles that cause defoliation in legumes and solanaceous crops.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Potato / Tomato", category: "Vegetable", damageDescription: "Defoliates upper leaf canopy.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Deltamethrin 2.8% EC", activeIngredient: "Deltamethrin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Pyrethroid contact insecticide.", effectivenessRating: "Essential" }
    ]
  },
  52: {
    name: "Spotted Alfalfa Aphid",
    scientificName: "Therioaphis maculata",
    description: "Yellowish aphid with dark spots that injects toxin into alfalfa, causing severe yellowing and leaf loss.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Alfalfa", category: "Forage", damageDescription: "Toxic saliva causes vein clearing, severe leaf drop, and stunting.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Pymetrozine 50% WG", activeIngredient: "Pymetrozine", type: "chemical", dosage: "0.5 g/L", applicationMethod: "Foliar spray upon detecting aphid spots.", safetyNotes: "Preserves beneficial predators.", effectivenessRating: "Essential" }
    ]
  },
  53: {
    name: "Odontothrips Loti",
    scientificName: "Odontothrips loti",
    description: "Thrips species infesting clover and alfalfa flowers, causing petal distortion and seed reduction.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Clover / Alfalfa", category: "Forage", damageDescription: "Damages flower organs, preventing pollination.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Spinetoram 11.7% SC", activeIngredient: "Spinetoram", type: "chemical", dosage: "0.8 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Selective thrips control.", effectivenessRating: "Essential" }
    ]
  },
  54: {
    name: "Thrips (General)",
    scientificName: "Thripidae family",
    description: "Slender insects with fringed wings that rasp leaf surfaces, leaving silvery sheen and black specks.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Causes leaf curling and silvery sheen on lower leaf surface.", severity: "High" },
      { cropName: "Onion", category: "Vegetable", damageDescription: "Silver blotches on onion leaves.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Fipronil 5% SC", activeIngredient: "Fipronil", type: "chemical", dosage: "1.5 ml/L", applicationMethod: "Foliar spray covering leaf undersides.", safetyNotes: "Highly toxic to bees.", effectivenessRating: "Essential" }
    ]
  },
  55: {
    name: "Alfalfa Seed Chalcid",
    scientificName: "Bruchophagus roddi",
    description: "Tiny wasp whose larvae feed inside individual developing alfalfa seeds, leaving hollow seed shells.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Alfalfa", category: "Forage", damageDescription: "Larvae consume seed kernels, creating hollow lightweight seeds.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 20% EC", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "2 ml/L", applicationMethod: "Apply early before pod formation.", safetyNotes: "Sanitate infected crop debris post-harvest.", effectivenessRating: "Essential" }
    ]
  },
  56: {
    name: "Cabbage Butterfly (Pieris Canidia)",
    scientificName: "Pieris canidia",
    description: "Green caterpillar of the Asian cabbage butterfly that defoliates brassicas and cabbage crops.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cabbage / Cauliflower", category: "Crucifer", damageDescription: "Chews large holes in cabbage leaves and head outer layers.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Bacillus thuringiensis (Bt)", activeIngredient: "Bt Kurstaki", type: "organic", dosage: "2 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Biological control safe for humans.", effectivenessRating: "High (Organic)" }
    ]
  },
  57: {
    name: "Green Capsid Bug (Apolygus Lucorum)",
    scientificName: "Apolygus lucorum",
    description: "Small green mirid bug sucking sap from cotton squares, fruit trees, and tea plants.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Sucks square sap causing dark spots and boll abortion.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Flonicamid 50% WG", activeIngredient: "Flonicamid", type: "chemical", dosage: "0.3 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Selective feeding inhibitor.", effectivenessRating: "Essential" }
    ]
  },
  58: {
    name: "Limacodidae (Slug Caterpillar)",
    scientificName: "Limacodidae family",
    description: "Stinging slug caterpillars with colorful urticating spines that defoliate fruit trees and tea bushes.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Fruit Trees / Tea", category: "Perennial", damageDescription: "Defoliates tree canopy; stinging hairs irritate workers.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Emamectin Benzoate 5% SG", activeIngredient: "Emamectin Benzoate", type: "chemical", dosage: "0.4 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Wear protective suit.", effectivenessRating: "Essential" }
    ]
  },
  59: {
    name: "Grape Phylloxera (Viteus Vitifoliae)",
    scientificName: "Viteus vitifoliae",
    description: "Microscopic aphid-like insect forming galls on grapevine roots and leaves, killing grape vines.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Root galls destroy vine root absorption, causing vine death.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Spirotetramat 150 OD", activeIngredient: "Spirotetramat", type: "chemical", dosage: "0.75 ml/L", applicationMethod: "2-way systemic foliar spray.", safetyNotes: "Moves to roots via phloem.", effectivenessRating: "Essential" }
    ]
  },
  60: {
    name: "Grape Erineum Mite (Colomerus Vitis)",
    scientificName: "Colomerus vitis",
    description: "Microscopic mite causing raised felt-like blisters (galls) on the upper surface of grape leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Creates white/brown felty erinea galls on grape leaf undersides.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Wettable Sulfur 80% WP", activeIngredient: "Elemental Sulfur", type: "organic", dosage: "3 g/L", applicationMethod: "Spray early spring at bud break.", safetyNotes: "Organic miticide and fungicide.", effectivenessRating: "High (Organic)" }
    ]
  },
  61: {
    name: "Citrus Flat Mite (Brevipalpus Lewisi)",
    scientificName: "Brevipalpus lewisi",
    description: "Flat red mite that infests citrus and grapes, causing scab-like skin blemishes on fruit.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus / Grapes", category: "Fruit", damageDescription: "Causes silvering and corky scar tissue on fruit rind.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Abamectin 1.9% EC", activeIngredient: "Abamectin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray with horticultural oil.", safetyNotes: "Translaminar miticide.", effectivenessRating: "Essential" }
    ]
  },
  62: {
    name: "Ten-Spotted Leaf Beetle (Oides Decempunctata)",
    scientificName: "Oides decempunctata",
    description: "Yellow leaf beetle with ten black spots that feeds on grapevine leaves, causing heavy defoliation.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Adults and larvae skeletonize grapevine leaves.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Lambda-Cyhalothrin 5% EC", activeIngredient: "Lambda-Cyhalothrin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Pyrethroid contact spray.", effectivenessRating: "Essential" }
    ]
  },
  63: {
    name: "Broad Mite (Polyphagotarsonemus Latus)",
    scientificName: "Polyphagotarsonemus latus",
    description: "Microscopic mite causing rigid, curled, strap-like leaves and corky russeting on peppers and cotton.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Chilli / Pepper", category: "Vegetable", damageDescription: "Leaves curl downwards with bronze/corky underside.", severity: "Severe" },
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Stunted terminal growth.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Spiromesifen 22.9% SC", activeIngredient: "Spiromesifen", type: "chemical", dosage: "1 ml/L", applicationMethod: "Spray growing tips.", safetyNotes: "Selective miticide.", effectivenessRating: "Essential" }
    ]
  },
  64: {
    name: "Comstock Mealybug (Pseudococcus Comstocki)",
    scientificName: "Pseudococcus comstocki",
    description: "White waxy mealybug infesting fruit trunks, branches, and fruits, excreting honeydew and sooty mold.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Apple / Pear", category: "Fruit", damageDescription: "Waxy clusters inside fruit calyx causing fruit distortion and sooty mold.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Buprofezin 25% SC + Neem Oil", activeIngredient: "Buprofezin", type: "chemical", dosage: "1.5 ml/L + 3 ml/L Neem Oil", applicationMethod: "High pressure spray to penetrate waxy coating.", safetyNotes: "Neem helps dissolve wax layer.", effectivenessRating: "Essential" }
    ]
  },
  65: {
    name: "Grape Clearwing Moth (Parathrene Regalis)",
    scientificName: "Parathrene regalis",
    description: "Boring caterpillar that excavates tunnels in grapevine branches, causing shoot dieback.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Bores inside main vine canes, leading to wilting branches.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorantraniliprole 18.5% SC", activeIngredient: "Chlorantraniliprole", type: "chemical", dosage: "0.4 ml/L", applicationMethod: "Spray vine trunks after adult emergence.", safetyNotes: "Target egg laying sites.", effectivenessRating: "Essential" }
    ]
  },
  66: {
    name: "Ampelophaga (Vine Hawkmoth)",
    scientificName: "Ampelophaga rubiginosa",
    description: "Large green hawkmoth caterpillar that rapidly consumes entire grapevine leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Large hornworms defoliate vine shoots rapidly.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Emamectin Benzoate 5% SG", activeIngredient: "Emamectin Benzoate", type: "chemical", dosage: "0.4 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Hand-pick large caterpillars if practical.", effectivenessRating: "Essential" }
    ]
  },
  67: {
    name: "Spotted Lanternfly (Lycorma Delicatula)",
    scientificName: "Lycorma delicatula",
    description: "Planthopper pest that feeds on sap of grapevines and fruit trees, excreting large amounts of sooty honeydew.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Sucks sap causing vine dieback, reduced sugar content, and black mold.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Dinotefuran 20% SG", activeIngredient: "Dinotefuran", type: "chemical", dosage: "0.5 g/L", applicationMethod: "Trunk spray or foliar application.", safetyNotes: "Systemic neonicotinoid.", effectivenessRating: "Essential" }
    ]
  },
  68: {
    name: "Xylotrechus (Grape Longhorn Beetle)",
    scientificName: "Xylotrechus pyrrhoderus",
    description: "Longhorn beetle whose grubs bore deeply into wooden trunks of grapevines, structural stems, and trees.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Internal wood borer causing branch breakage and vine death.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Dichlorvos 76% EC", activeIngredient: "Dichlorvos", type: "chemical", dosage: "Inject into boreholes", applicationMethod: "Inject 2 ml into borer holes and seal with mud.", safetyNotes: "Fumigant action inside stem.", effectivenessRating: "Essential" }
    ]
  },
  69: {
    name: "Green Leafhopper (Cicadella Viridis)",
    scientificName: "Cicadella viridis",
    description: "Bright green leafhopper sucking sap from stems and leaves of rice, fruit trees, and vegetables.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Rice / Fruit Trees", category: "Agricultural", damageDescription: "Egg oviposition scars twigs and sap feeding yellow leaves.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Wear protective clothing.", effectivenessRating: "Essential" }
    ]
  },
  70: {
    name: "Mirid Bug (Miridae)",
    scientificName: "Miridae family",
    description: "Plant bugs that puncture tender buds, leaves, and young fruits, causing necrotic brown spotting.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cotton / Vegetables", category: "Agricultural", damageDescription: "Punctures young squares causing bud drop.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Flonicamid 50% WG", activeIngredient: "Flonicamid", type: "chemical", dosage: "0.3 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Selective mirid control.", effectivenessRating: "Essential" }
    ]
  },
  71: {
    name: "Greenhouse Whitefly (Trialeurodes Vaporariorum)",
    scientificName: "Trialeurodes vaporariorum",
    description: "Tiny white winged insects sucking sap from greenhouse tomatoes, peppers, and ornamentals.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Tomato", category: "Vegetable", damageDescription: "Sucks sap, excretes honeydew, and spreads plant viruses.", severity: "Severe" },
      { cropName: "Cucumber", category: "Vegetable", damageDescription: "Sooty mold accumulation on leaves.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Spiroframe / Spirotetramat 150 OD", activeIngredient: "Spirotetramat", type: "chemical", dosage: "0.75 ml/L", applicationMethod: "Systemic foliar spray.", safetyNotes: "Controls all nymph stages.", effectivenessRating: "Essential" },
      { name: "Yellow Sticky Traps + Neem Oil", activeIngredient: "Azadirachtin", type: "organic", dosage: "5 ml/L", applicationMethod: "Hang yellow sticky traps and spray neem oil.", safetyNotes: "Organic IPM strategy.", effectivenessRating: "High (Organic)" }
    ]
  },
  72: {
    name: "Grape Leafhopper (Erythroneura Apicalis)",
    scientificName: "Erythroneura apicalis",
    description: "Small leafhopper causing white stippling and pale chlorotic blotches on grapevine foliage.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Grapes", category: "Fruit", damageDescription: "Destroys leaf chlorophyll, leading to premature leaf drop.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Acetamiprid 20% SP", activeIngredient: "Acetamiprid", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Translaminar protection.", effectivenessRating: "Essential" }
    ]
  },
  73: {
    name: "Asian Swallowtail Caterpillar (Papilio Xuthus)",
    scientificName: "Papilio xuthus",
    description: "Large caterpillar feeding on young citrus leaves, resembling bird droppings when young.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Chews leaves of young citrus nursery plants.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Bacillus thuringiensis (Bt)", activeIngredient: "Bt Kurstaki", type: "organic", dosage: "2 g/L", applicationMethod: "Target young caterpillars on citrus shoots.", safetyNotes: "Safe bio-insecticide.", effectivenessRating: "High (Organic)" }
    ]
  },
  74: {
    name: "Citrus Red Mite (Panonychus Citri)",
    scientificName: "Panonychus citri",
    description: "Major citrus spider mite causing pale stippling, graying leaf surfaces, and fruit rind browning.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus (Orange/Lemon)", category: "Fruit", damageDescription: "Feeds on leaves and fruit rinds, turning foliage gray-pale.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Spiromesifen 22.9% SC", activeIngredient: "Spiromesifen", type: "chemical", dosage: "1 ml/L", applicationMethod: "Foliar spray covering entire tree canopy.", safetyNotes: "Effective on eggs and nymphs.", effectivenessRating: "Essential" }
    ]
  },
  75: {
    name: "Citrus Rust Mite (Phyllocoptes Oleiverus)",
    scientificName: "Phyllocoptes oleiverus",
    description: "Microscopic eriophyid mite that turns oranges brown/russeted and lemons silver.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Rind russeting turns oranges dark brown ('shark skin').", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Wettable Sulfur 80% WP", activeIngredient: "Elemental Sulfur", type: "organic", dosage: "3 g/L", applicationMethod: "Foliar canopy spray.", safetyNotes: "Do not spray above 32°C.", effectivenessRating: "High (Organic)" },
      { name: "Abamectin 1.9% EC", activeIngredient: "Abamectin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Translaminar action.", effectivenessRating: "Essential" }
    ]
  },
  76: {
    name: "Cottony Cushion Scale (Icerya Purchasi)",
    scientificName: "Icerya purchasi",
    description: "Scale insect with a distinct white fluted ovisac that sucks sap from citrus twigs and branches.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Sucks branch sap, causing twig dieback and heavy sooty mold.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Rodolia cardinalis (Vedalia Beetle)", activeIngredient: "Predatory Beetle", type: "organic", dosage: "Biological Release", applicationMethod: "Release biological predatory beetles in orchard.", safetyNotes: "Famous successful biocontrol.", effectivenessRating: "High (Organic)" },
      { name: "Buprofezin 25% SC + Mineral Oil", activeIngredient: "Buprofezin", type: "chemical", dosage: "1.5 ml/L + 1% Mineral Oil", applicationMethod: "Spray branches thoroughly.", safetyNotes: "Mineral oil dissolves wax.", effectivenessRating: "Essential" }
    ]
  },
  77: {
    name: "Arrowhead Scale (Unaspis Yanonensis)",
    scientificName: "Unaspis yanonensis",
    description: "Armored scale pest of citrus that forms brown/white encrustations on leaves and fruits, causing branch dieback.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Leaves yellow around scales and drop; twigs die.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Pyriproxyfen 10% EC + Horticultural Oil", activeIngredient: "Pyriproxyfen", type: "chemical", dosage: "1 ml/L + 1% Oil", applicationMethod: "Spray during crawler emergence in spring.", safetyNotes: "Insect growth regulator.", effectivenessRating: "Essential" }
    ]
  },
  78: {
    name: "Red Wax Scale (Ceroplastes Rubens)",
    scientificName: "Ceroplastes rubens",
    description: "Pinkish-red waxy scale insect infesting citrus, tea, and mango leaves, causing dense sooty mold.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus / Mango", category: "Fruit", damageDescription: "Dense waxy colonies excrete honeydew covering leaves in black mold.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Spirogame / Spirotetramat 150 OD", activeIngredient: "Spirotetramat", type: "chemical", dosage: "0.75 ml/L", applicationMethod: "Systemic foliar spray.", safetyNotes: "Moves through phloem to scale insects.", effectivenessRating: "Essential" }
    ]
  },
  79: {
    name: "Florida Red Scale (Chrysomphalus Aonidum)",
    scientificName: "Chrysomphalus aonidum",
    description: "Circular dark reddish-brown armored scale infesting citrus fruit rinds and leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Yellow chlorotic spots on leaves and unmarketable spotted fruit.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 20% EC + Summer Oil", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "2 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Thorough coverage required.", effectivenessRating: "Essential" }
    ]
  },
  80: {
    name: "Black Scale (Parlatoria Zizyphus)",
    scientificName: "Parlatoria zizyphus",
    description: "Black rectangular scale insect that forms thick crusts on citrus leaves, twigs, and fruit rind.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Black scale crusts reduce fruit market value and cause leaf drop.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Pyriproxyfen 10% EC", activeIngredient: "Pyriproxyfen", type: "chemical", dosage: "1 ml/L", applicationMethod: "Spray at 1st instar crawler stage.", safetyNotes: "Target young crawlers.", effectivenessRating: "Essential" }
    ]
  },
  81: {
    name: "Spherical Mealybug (Nipaecoccus Vastalor)",
    scientificName: "Nipaecoccus viridis",
    description: "Cottony waxy mealybug causing terminal shoot swelling, leaf curling, and fruit drop in citrus.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Causes swollen distorted twigs, leaf curling, and yellowing.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Chlorpyrifos 50% EC + Neem Oil", activeIngredient: "Chlorpyrifos", type: "chemical", dosage: "2 ml/L + 5 ml/L Neem Oil", applicationMethod: "High pressure spray.", safetyNotes: "Neem oil aids wax penetration.", effectivenessRating: "Essential" }
    ]
  },
  82: {
    name: "Orange Spiny Whitefly (Aleurocanthus Spiniferus)",
    scientificName: "Aleurocanthus spiniferus",
    description: "Black spiny nymphs of whitefly that infest citrus leaf undersides, producing honeydew and black soot.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Infests lower leaf surface with black spiny nymph crusts.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Acetamiprid 20% SP", activeIngredient: "Acetamiprid", type: "chemical", dosage: "0.25 g/L", applicationMethod: "Foliar spray underneath leaves.", safetyNotes: "Translaminar action.", effectivenessRating: "Essential" }
    ]
  },
  83: {
    name: "Chinese Citrus Fly (Bactrocera Minax)",
    scientificName: "Bactrocera minax",
    description: "Large fruit fly whose maggots feed inside citrus fruits, causing premature fruit yellowing and drop.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus (Orange)", category: "Fruit", damageDescription: "Maggots eat internal pulp; infected oranges turn yellow and drop.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Protein Hydrolysate + Spinosad Bait Spray", activeIngredient: "Spinosad Bait", type: "organic", dosage: "Spot spray on tree trunk", applicationMethod: "Apply protein bait traps/spot sprays to attract adult flies.", safetyNotes: "Eco-friendly bait technique.", effectivenessRating: "High (Organic)" }
    ]
  },
  84: {
    name: "Oriental Fruit Fly (Dacus Dorsalis / Bactrocera Dorsalis)",
    scientificName: "Bactrocera dorsalis",
    description: "Major fruit fly pest laying eggs inside mango, guava, citrus, and papaya, turning flesh to liquid decay.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Mango", category: "Fruit", damageDescription: "Maggots destroy internal mango pulp, causing total crop loss.", severity: "Severe" },
      { cropName: "Guava / Citrus", category: "Fruit", damageDescription: "Fruit oviposition punctures and maggot rot.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Methyl Eugenol Pheromone Traps", activeIngredient: "Methyl Eugenol", type: "organic", dosage: "10 traps/acre", applicationMethod: "Hang traps 1.5m above ground in orchard.", safetyNotes: "Attracts and kills male flies.", effectivenessRating: "High (Organic)" },
      { name: "Malathion 50% EC + Molasses Bait", activeIngredient: "Malathion", type: "chemical", dosage: "2 ml/L + 10g sugar", applicationMethod: "Bait spray on non-fruit foliage.", safetyNotes: "Target adult flies.", effectivenessRating: "Essential" }
    ]
  },
  85: {
    name: "Japanese Citrus Fly (Bactrocera Tsuneonis)",
    scientificName: "Bactrocera tsuneonis",
    description: "Citrus fruit fly species causing internal maggot rot and premature fruit fall.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Larval feeding in citrus segments leads to fruit rot.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Spinosad 45% SC Bait", activeIngredient: "Spinosad", type: "chemical", dosage: "0.2 ml/L", applicationMethod: "Apply spot bait spray to orchard border trees.", safetyNotes: "Safe targeted bait.", effectivenessRating: "Essential" }
    ]
  },
  86: {
    name: "Tobacco Cutworm (Prodenia Litura / Spodoptera Litura)",
    scientificName: "Spodoptera litura",
    description: "Voracious caterpillar pest of cotton, tobacco, groundnut, and vegetables, feeding on leaves and pods.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Skeletonizes foliage and bores into bolls.", severity: "Severe" },
      { cropName: "Groundnut / Tobacco", category: "Agricultural", damageDescription: "Defoliates crops rapidly.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Emamectin Benzoate 5% SG", activeIngredient: "Emamectin Benzoate", type: "chemical", dosage: "0.4 g/L", applicationMethod: "Foliar spray when egg masses hatch.", safetyNotes: "Effective on caterpillar instars.", effectivenessRating: "Essential" }
    ]
  },
  87: {
    name: "Adristyrannus (Citrus Sawfly)",
    scientificName: "Adristyrannus spp.",
    description: "Sawfly caterpillar-like larvae that feed on young tender citrus leaves.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Feeds on tender flush leaves of citrus trees.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Lambda-Cyhalothrin 5% EC", activeIngredient: "Lambda-Cyhalothrin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray during new leaf flush.", safetyNotes: "Pyrethroid spray.", effectivenessRating: "Essential" }
    ]
  },
  88: {
    name: "Citrus Leafminer (Phyllocnistis Citrella)",
    scientificName: "Phyllocnistis citrella",
    description: "Tiny caterpillar that mines silvery serpentine tracks inside young citrus leaves, causing leaf curling and citrus canker.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus (Orange/Lemon)", category: "Fruit", damageDescription: "Silvery serpentine leaf mines cause leaf distortion and predispose trees to citrus canker.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Spray during new flush growth.", safetyNotes: "Systemic translaminar action.", effectivenessRating: "Essential" },
      { name: "Neem Oil 10,000 PPM", activeIngredient: "Azadirachtin", type: "organic", dosage: "3 ml/L", applicationMethod: "Foliar spray on new shoot flush.", safetyNotes: "Organic repellent.", effectivenessRating: "High (Organic)" }
    ]
  },
  89: {
    name: "Brown Citrus Aphid (Toxoptera Citricidus)",
    scientificName: "Toxoptera citricidus",
    description: "Dark aphid that is the primary vector of Citrus Tristeza Virus (CTV), infesting new shoot flushes.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus", category: "Fruit", damageDescription: "Transmits Citrus Tristeza Virus (CTV), leading to tree quick decline.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Thiamethoxam 25% WG", activeIngredient: "Thiamethoxam", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Spray new shoots immediately upon aphid sighting.", safetyNotes: "Systemic virus vector control.", effectivenessRating: "Essential" }
    ]
  },
  90: {
    name: "Black Citrus Aphid (Toxoptera Aurantii)",
    scientificName: "Toxoptera aurantii",
    description: "Shiny black aphid feeding on young citrus and tea shoots, causing leaf curling.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus / Tea", category: "Agricultural", damageDescription: "Curling of young tender flush leaves.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Acetamiprid 20% SP", activeIngredient: "Acetamiprid", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Translaminar control.", effectivenessRating: "Essential" }
    ]
  },
  91: {
    name: "Spirea Aphid (Aphis Citricola)",
    scientificName: "Aphis spiraecola",
    description: "Bright green aphid infesting citrus, apple, and spirea flush growth.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus / Apple", category: "Fruit", damageDescription: "Stunts growing terminal tips and causes leaf roll.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Systemic control.", effectivenessRating: "Essential" }
    ]
  },
  92: {
    name: "Chilli Thrips (Scirtothrips Dorsalis)",
    scientificName: "Scirtothrips dorsalis",
    description: "Extremely destructive thrips causing upward leaf curling, silvery leaf undersides, and brownish scars on fruit.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Chilli / Pepper", category: "Vegetable", damageDescription: "Leaves curl upward ('boat shape') with dark brownish scars.", severity: "Severe" },
      { cropName: "Citrus / Mango", category: "Fruit", damageDescription: "Rind scarring around fruit pedicel.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Spinetoram 11.7% SC", activeIngredient: "Spinetoram", type: "chemical", dosage: "0.8 ml/L (160 ml/acre)", applicationMethod: "Foliar spray at early thrips detection.", safetyNotes: "Outstanding thrips knockdown.", effectivenessRating: "Essential" }
    ]
  },
  93: {
    name: "Dasineura Gall Midge (Dasineura Sp)",
    scientificName: "Dasineura spp.",
    description: "Gall midge fly whose larvae feed inside flower buds and leaves, causing bud distortion and drop.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Mango / Crops", category: "Agricultural", damageDescription: "Galls in tender leaves and flower panicles.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Fipronil 5% SC", activeIngredient: "Fipronil", type: "chemical", dosage: "1.5 ml/L", applicationMethod: "Foliar spray prior to panicle bloom.", safetyNotes: "Target adult midges.", effectivenessRating: "Essential" }
    ]
  },
  94: {
    name: "Lawana Leafhopper (Lawana Imitata)",
    scientificName: "Lawana imitata",
    description: "White moth-like flatid planthopper covered in white waxy powder, sucking sap from tea and fruit trees.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Tea / Fruit Trees", category: "Agricultural", damageDescription: "White waxy nymphs cover stems and suck sap.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Buprofezin 25% SC", activeIngredient: "Buprofezin", type: "chemical", dosage: "1.25 ml/L", applicationMethod: "Foliar spray on waxy nymph clusters.", safetyNotes: "Growth regulator.", effectivenessRating: "Essential" }
    ]
  },
  95: {
    name: "Salurnis Marginella Leafhopper",
    scientificName: "Salurnis marginella",
    description: "Green flatid planthopper with reddish leaf margins feeding on tea and citrus shoots.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Citrus / Tea", category: "Agricultural", damageDescription: "Sucks sap from young twigs, leading to shoot wilting.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Foliar spray.", safetyNotes: "Wear protective suit.", effectivenessRating: "Essential" }
    ]
  },
  96: {
    name: "Mango Leaf-Cutting Weevil (Deporaus Marginatus)",
    scientificName: "Deporaus marginatus",
    description: "Reddish-brown weevil that cuts off young tender mango leaves cleanly as if cut by scissors.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Mango", category: "Fruit", damageDescription: "Weevil cuts young copper-colored flush leaves cleanly at petiole.", severity: "High" }
    ],
    recommendedPesticides: [
      { name: "Cypermethrin 10% EC", activeIngredient: "Cypermethrin", type: "chemical", dosage: "1 ml/L", applicationMethod: "Spray new leaf flush immediately.", safetyNotes: "Pyrethroid spray.", effectivenessRating: "Essential" }
    ]
  },
  97: {
    name: "Mango Shoot Borer (Chlumetia Transversa)",
    scientificName: "Chlumetia transversa",
    description: "Caterpillar that bores into young mango shoots and tender panicles, causing shoot tip drying and dieback.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Mango", category: "Fruit", damageDescription: "Bores into tender new shoots, causing wilting, drying, and tip death.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Chlorantraniliprole 18.5% SC", activeIngredient: "Chlorantraniliprole", type: "chemical", dosage: "0.4 ml/L", applicationMethod: "Spray new shoot flush.", safetyNotes: "Systemic protection.", effectivenessRating: "Essential" }
    ]
  },
  98: {
    name: "Mango Flat Beak Leafhopper",
    scientificName: "Idioscopus clypealis",
    description: "Major mango hopper that infests panicles, sucking sap and causing 100% flower drop ('hopperburn').",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Mango", category: "Fruit", damageDescription: "Sucks sap from panicles, causing flower drop, honeydew, and sooty mold.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Imidacloprid 17.8% SL", activeIngredient: "Imidacloprid", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Spray panicles prior to flower opening.", safetyNotes: "Do not spray during full bloom.", effectivenessRating: "Essential" },
      { name: "Neem Oil 10,000 PPM", activeIngredient: "Azadirachtin", type: "organic", dosage: "3 ml/L", applicationMethod: "Foliar spray at panicle emergence.", safetyNotes: "Organic repellent.", effectivenessRating: "High (Organic)" }
    ]
  },
  99: {
    name: "Mango Stem Borer (Rhytidodera Bowringii)",
    scientificName: "Rhytidodera bowringii",
    description: "Large longhorn beetle grub that tunnels inside mango branches and trunks, causing branch collapse.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Mango", category: "Fruit", damageDescription: "Tunnels in wood, ejecting coarse frass and causing branch death.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Dichlorvos 76% EC (Borer Hole Injection)", activeIngredient: "Dichlorvos", type: "chemical", dosage: "5 ml per borehole", applicationMethod: "Clear frass, inject into borehole, and plug with clay/mud.", safetyNotes: "Fumigant borehole treatment.", effectivenessRating: "Essential" }
    ]
  },
  100: {
    name: "Mango Seed Weevil (Sternochetus Frigidus)",
    scientificName: "Sternochetus frigidus",
    description: "Weevil whose larvae bore into green mango fruit and feed inside the seed kernel without external signs.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Mango", category: "Fruit", damageDescription: "Larvae ruin internal seed and surrounding flesh, rendering fruit unmarketable.", severity: "Severe" }
    ],
    recommendedPesticides: [
      { name: "Deltamethrin 2.8% EC", activeIngredient: "Deltamethrin", type: "chemical", dosage: "0.5 ml/L", applicationMethod: "Spray tree trunk and main scaffold limbs during marble-stage fruit.", safetyNotes: "Target adult weevils.", effectivenessRating: "Essential" }
    ]
  },
  101: {
    name: "Cicadellidae (General Leafhopper)",
    scientificName: "Cicadellidae family",
    description: "Small wedge-shaped sap-sucking insects that jump quickly when disturbed, causing leaf curling and chlorosis.",
    isHarmful: true,
    affectedCrops: [
      { cropName: "Cotton", category: "Cash Crop", damageDescription: "Sucks sap causing 'hopperburn' leaf margin browning.", severity: "High" },
      { cropName: "Vegetables", category: "Vegetable", damageDescription: "Leaf curling and yellowing.", severity: "Medium" }
    ],
    recommendedPesticides: [
      { name: "Thiamethoxam 25% WG", activeIngredient: "Thiamethoxam", type: "chemical", dosage: "0.2 g/L", applicationMethod: "Foliar spray.", safetyNotes: "Fast systemic control.", effectivenessRating: "Essential" }
    ]
  }
};

/**
 * Get IP102 Metadata by Class ID (0-101) or by Class Name search string
 */
function getIp102Metadata(classIdOrName) {
  if (typeof classIdOrName === 'number' && IP102_SPECIES_MAP[classIdOrName]) {
    return IP102_SPECIES_MAP[classIdOrName];
  }

  if (typeof classIdOrName === 'string') {
    const searchStr = classIdOrName.toLowerCase().trim();
    // 1. Direct key match
    for (const [idStr, meta] of Object.entries(IP102_SPECIES_MAP)) {
      if (meta.name.toLowerCase() === searchStr || meta.scientificName.toLowerCase() === searchStr) {
        return meta;
      }
    }
    // 2. Partial match
    for (const [idStr, meta] of Object.entries(IP102_SPECIES_MAP)) {
      if (meta.name.toLowerCase().includes(searchStr) || searchStr.includes(meta.name.toLowerCase())) {
        return meta;
      }
    }
  }

  // Fallback to default Aphids (#24) or Rice Leaf Roller (#0)
  return IP102_SPECIES_MAP[24] || IP102_SPECIES_MAP[0];
}

module.exports = {
  IP102_SPECIES_MAP,
  getIp102Metadata
};
