const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Pests, Crops, and Pesticides...');

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

  // 4. Link Pest-Crops
  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: aphids.id, cropId: wheat.id } },
    update: {},
    create: {
      pestId: aphids.id,
      cropId: wheat.id,
      damageDescription: 'Sucks sap from wheat tillers and ears, causing yellowing and yield drop.',
      severity: 'High'
    }
  });

  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: armyworm.id, cropId: maize.id } },
    update: {},
    create: {
      pestId: armyworm.id,
      cropId: maize.id,
      damageDescription: 'Defoliation of maize leaves and severe damage to growing whorls.',
      severity: 'Severe'
    }
  });

  await prisma.pestCrop.upsert({
    where: { pestId_cropId: { pestId: whitefly.id, cropId: cotton.id } },
    update: {},
    create: {
      pestId: whitefly.id,
      cropId: cotton.id,
      damageDescription: 'Causes soot mold and spreads Cotton Leaf Curl Virus (CLCV).',
      severity: 'Severe'
    }
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
    where: { pestId_pesticideId: { pestId: armyworm.id, pesticideId: btOrganic.id } },
    update: {},
    create: { pestId: armyworm.id, pesticideId: btOrganic.id, effectivenessRating: 'High (Organic)' }
  });

  await prisma.pestPesticide.upsert({
    where: { pestId_pesticideId: { pestId: whitefly.id, pesticideId: imidacloprid.id } },
    update: {},
    create: { pestId: whitefly.id, pesticideId: imidacloprid.id, effectivenessRating: 'Essential' }
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
