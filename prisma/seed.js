const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with 12 Pests, Crops, and Pesticides...');

  // 1. Seed Crops
  const wheat = await prisma.crop.upsert({
    where: { name: 'Wheat' },
    update: {},
    create: { name: 'Wheat', category: 'Cereal' }
  });

  const cotton = await prisma.crop.upsert({
    where: { name: 'Cotton' },
    update: {},
    create: { name: 'Cotton', category: 'Cash Crop' }
  });

  const rice = await prisma.crop.upsert({
    where: { name: 'Rice' },
    update: {},
    create: { name: 'Rice', category: 'Grain' }
  });

  const maize = await prisma.crop.upsert({
    where: { name: 'Maize' },
    update: {},
    create: { name: 'Maize', category: 'Cereal' }
  });

  const tomato = await prisma.crop.upsert({
    where: { name: 'Tomato' },
    update: {},
    create: { name: 'Tomato', category: 'Vegetable' }
  });

  // 2. Seed Pesticides
  const neemOil = await prisma.pesticide.upsert({
    where: { name: 'Neem Oil Botanical Extract' },
    update: {},
    create: {
      name: 'Neem Oil Botanical Extract',
      activeIngredient: 'Azadirachtin 0.15% EC',
      type: 'organic',
      dosage: '5 ml per liter of water',
      applicationMethod: 'Foliar spray early morning or late evening. Repeat every 7 days.',
      safetyNotes: 'Non-toxic to humans and bees. Safe organic option.'
    }
  });

  const imidacloprid = await prisma.pesticide.upsert({
    where: { name: 'Imidacloprid 200 SL' },
    update: {},
    create: {
      name: 'Imidacloprid 200 SL',
      activeIngredient: 'Imidacloprid 17.8% SL',
      type: 'chemical',
      dosage: '0.5 ml per liter of water (50-100 ml/acre)',
      applicationMethod: 'Foliar spray at early infestation threshold.',
      safetyNotes: 'Wear gloves and mask during spray. Keep away from honey bees during flowering.'
    }
  });

  const emamectin = await prisma.pesticide.upsert({
    where: { name: 'Emamectin Benzoate 5% SG' },
    update: {},
    create: {
      name: 'Emamectin Benzoate 5% SG',
      activeIngredient: 'Emamectin Benzoate',
      type: 'chemical',
      dosage: '0.4 grams per liter of water (80g/acre)',
      applicationMethod: 'Target plant foliage and whorls where larvae feed.',
      safetyNotes: 'Harmful if swallowed or inhaled. Avoid direct contact with skin.'
    }
  });

  const btOrganic = await prisma.pesticide.upsert({
    where: { name: 'Bacillus thuringiensis (Bt) Bio-Insecticide' },
    update: {},
    create: {
      name: 'Bacillus thuringiensis (Bt) Bio-Insecticide',
      activeIngredient: 'Bt Kurstaki Strain',
      type: 'organic',
      dosage: '2 grams per liter of water',
      applicationMethod: 'Spray directly on crop leaves when young caterpillars appear.',
      safetyNotes: 'Eco-friendly and organic certified. Safe for beneficial insects.'
    }
  });

  const spinetoram = await prisma.pesticide.upsert({
    where: { name: 'Spinetoram 11.7% SC' },
    update: {},
    create: {
      name: 'Spinetoram 11.7% SC',
      activeIngredient: 'Spinetoram',
      type: 'chemical',
      dosage: '0.8 ml per liter of water (160 ml/acre)',
      applicationMethod: 'Foliar spray at early boll formation stage.',
      safetyNotes: 'Toxic to aquatic organisms.'
    }
  });

  const chlorantraniliprole = await prisma.pesticide.upsert({
    where: { name: 'Chlorantraniliprole 18.5% SC' },
    update: {},
    create: {
      name: 'Chlorantraniliprole 18.5% SC',
      activeIngredient: 'Chlorantraniliprole',
      type: 'chemical',
      dosage: '0.4 ml per liter of water (50 ml/acre)',
      applicationMethod: 'Apply at early stem elongation stage.',
      safetyNotes: 'Target active larvae.'
    }
  });

  const abamectin = await prisma.pesticide.upsert({
    where: { name: 'Abamectin 1.8% EC' },
    update: {},
    create: {
      name: 'Abamectin 1.8% EC',
      activeIngredient: 'Abamectin',
      type: 'chemical',
      dosage: '0.5 ml per liter of water',
      applicationMethod: 'Spray thoroughly on lower leaf surfaces.',
      safetyNotes: 'Toxic to bees. Apply late evening.'
    }
  });

  const tebuconazole = await prisma.pesticide.upsert({
    where: { name: 'Tebuconazole 250 EC Fungicide' },
    update: {},
    create: {
      name: 'Tebuconazole 250 EC Fungicide',
      activeIngredient: 'Tebuconazole 25% EC',
      type: 'chemical',
      dosage: '1 ml per liter of water (200 ml/acre)',
      applicationMethod: 'Foliar fungicide spray at first sign of pustules.',
      safetyNotes: 'Wear mask and protective clothing.'
    }
  });

  // 3. Seed Pests
  const aphids = await prisma.pest.upsert({
    where: { name: 'Aphids (Greenflies)' },
    update: {},
    create: {
      name: 'Aphids (Greenflies)',
      scientificName: 'Myzus persicae',
      description: 'Small sap-sucking insects that cause leaf curling, stunting, and honeydew mold growth.',
      isHarmfulDefault: true,
      imageUrl: 'https://images.unsplash.com/photo-1590740880194-e6fae853ca6c?w=500'
    }
  });

  const armyworm = await prisma.pest.upsert({
    where: { name: 'Fall Armyworm' },
    update: {},
    create: {
      name: 'Fall Armyworm',
      scientificName: 'Spodoptera frugiperda',
      description: 'Voracious caterpillar that eats leaves, whorls, and ears of maize and wheat crops.',
      isHarmfulDefault: true,
      imageUrl: 'https://images.unsplash.com/photo-1551085254-e96b210df58a?w=500'
    }
  });

  const whitefly = await prisma.pest.upsert({
    where: { name: 'Whitefly' },
    update: {},
    create: {
      name: 'Whitefly',
      scientificName: 'Bemisia tabaci',
      description: 'Tiny white flying insects sucking sap from cotton and tomato leaves, transmitting leaf curl viruses.',
      isHarmfulDefault: true,
      imageUrl: 'https://images.unsplash.com/photo-1543536448-1e76fc2795bf?w=500'
    }
  });

  const ladybug = await prisma.pest.upsert({
    where: { name: 'Ladybug (Ladybird Beetle)' },
    update: {},
    create: {
      name: 'Ladybug (Ladybird Beetle)',
      scientificName: 'Coccinellidae',
      description: 'Beneficial predatory insect that feeds on aphids and mites. Highly beneficial for crops!',
      isHarmfulDefault: false,
      imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500'
    }
  });

  const bollworm = await prisma.pest.upsert({
    where: { name: 'Pink Bollworm / Cotton Bollworm' },
    update: {},
    create: {
      name: 'Pink Bollworm / Cotton Bollworm',
      scientificName: 'Pectinophora gossypiella',
      description: 'Destructive moth larva that bores inside cotton bolls, destroying lint quality and seed yield.',
      isHarmfulDefault: true,
      imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500'
    }
  });

  const stemborer = await prisma.pest.upsert({
    where: { name: 'Rice Stem Borer' },
    update: {},
    create: {
      name: 'Rice Stem Borer',
      scientificName: 'Scirpophaga incertulas',
      description: 'Boring caterpillar that causes "dead hearts" in tillers and "white heads" in rice crops.',
      isHarmfulDefault: true,
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500'
    }
  });

  const spidermite = await prisma.pest.upsert({
    where: { name: 'Two-Spotted Spider Mite' },
    update: {},
    create: {
      name: 'Two-Spotted Spider Mite',
      scientificName: 'Tetranychus urticae',
      description: 'Tiny sap-sucking arachnids that cause speckling, bronze discoloration, and fine webbing on leaves.',
      isHarmfulDefault: true,
      imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500'
    }
  });

  const wheatrust = await prisma.pest.upsert({
    where: { name: 'Wheat Rust / Leaf Blight Disease' },
    update: {},
    create: {
      name: 'Wheat Rust / Leaf Blight Disease',
      scientificName: 'Puccinia striiformis / Fungal Disease',
      description: 'Fungal crop disease causing yellow, orange, or reddish-brown pustules and spots on cereal crop leaves.',
      isHarmfulDefault: true,
      imageUrl: 'https://images.unsplash.com/photo-1590740880194-e6fae853ca6c?w=500'
    }
  });

  // 4. Link Pest-Crops
  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: aphids.id, cropId: wheat.id } },
    update: {},
    create: { pestId: aphids.id, cropId: wheat.id, damageDescription: 'Sucks sap from wheat tillers, causing yellowing and yield drop.', severity: 'High' }
  });

  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: armyworm.id, cropId: maize.id } },
    update: {},
    create: { pestId: armyworm.id, cropId: maize.id, damageDescription: 'Defoliation of maize leaves and severe damage to growing whorls.', severity: 'Severe' }
  });

  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: whitefly.id, cropId: cotton.id } },
    update: {},
    create: { pestId: whitefly.id, cropId: cotton.id, damageDescription: 'Causes soot mold and spreads Cotton Leaf Curl Virus (CLCV).', severity: 'Severe' }
  });

  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: bollworm.id, cropId: cotton.id } },
    update: {},
    create: { pestId: bollworm.id, cropId: cotton.id, damageDescription: 'Bores inside green bolls causing lint damage.', severity: 'Severe' }
  });

  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: stemborer.id, cropId: rice.id } },
    update: {},
    create: { pestId: stemborer.id, cropId: rice.id, damageDescription: 'Bores into rice stems preventing grain filling.', severity: 'Severe' }
  });

  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: wheatrust.id, cropId: wheat.id } },
    update: {},
    create: { pestId: wheatrust.id, cropId: wheat.id, damageDescription: 'Yellow stripes and pustules on leaves leading to grain shriveling.', severity: 'Severe' }
  });

  // 5. Link Pest-Pesticides
  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: aphids.id, pesticideId: neemOil.id } },
    update: {},
    create: { pestId: aphids.id, pesticideId: neemOil.id, effectivenessRating: 'High (Organic)' }
  });

  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: aphids.id, pesticideId: imidacloprid.id } },
    update: {},
    create: { pestId: aphids.id, pesticideId: imidacloprid.id, effectivenessRating: 'Essential (Chemical)' }
  });

  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: armyworm.id, pesticideId: emamectin.id } },
    update: {},
    create: { pestId: armyworm.id, pesticideId: emamectin.id, effectivenessRating: 'Essential' }
  });

  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: bollworm.id, pesticideId: spinetoram.id } },
    update: {},
    create: { pestId: bollworm.id, pesticideId: spinetoram.id, effectivenessRating: 'Essential' }
  });

  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: stemborer.id, pesticideId: chlorantraniliprole.id } },
    update: {},
    create: { pestId: stemborer.id, pesticideId: chlorantraniliprole.id, effectivenessRating: 'Essential' }
  });

  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: spidermite.id, pesticideId: abamectin.id } },
    update: {},
    create: { pestId: spidermite.id, pesticideId: abamectin.id, effectivenessRating: 'Essential' }
  });

  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: wheatrust.id, pesticideId: tebuconazole.id } },
    update: {},
    create: { pestId: wheatrust.id, pesticideId: tebuconazole.id, effectivenessRating: 'Essential' }
  });

  console.log('Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
