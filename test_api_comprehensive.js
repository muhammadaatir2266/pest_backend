const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { classifyPestImage } = require('./src/services/pestClassifier.service');

// Test images - real pest/agriculture scenarios
const TEST_CASES = [
  {
    name: '1. GREEN LEAF with brown spots (disease)',
    create: async () => {
      const base = await sharp({ create: { width: 600, height: 400, channels: 3, background: { r: 60, g: 140, b: 50 } } }).png().toBuffer();
      return sharp(base)
        .composite([
          { input: await sharp({ create: { width: 40, height: 40, channels: 3, background: { r: 120, g: 70, b: 30 } } }).png().toBuffer(), top: 100, left: 200 },
          { input: await sharp({ create: { width: 45, height: 35, channels: 3, background: { r: 110, g: 60, b: 25 } } }).png().toBuffer(), top: 200, left: 350 },
          { input: await sharp({ create: { width: 50, height: 30, channels: 3, background: { r: 130, g: 80, b: 35 } } }).png().toBuffer(), top: 150, left: 150 },
        ]).jpeg({ quality: 85 }).toBuffer();
    }
  },
  {
    name: '2. RED/ORANGE BEETLE on leaf (ladybug)',
    create: async () => {
      const base = await sharp({ create: { width: 500, height: 500, channels: 3, background: { r: 50, g: 130, b: 40 } } }).png().toBuffer();
      return sharp(base)
        .composite([
          { input: await sharp({ create: { width: 100, height: 70, channels: 3, background: { r: 210, g: 80, b: 20 } } }).png().toBuffer(), top: 200, left: 200 },
          { input: await sharp({ create: { width: 40, height: 30, channels: 3, background: { r: 30, g: 20, b: 15 } } }).png().toBuffer(), top: 195, left: 230 },
        ]).jpeg({ quality: 85 }).toBuffer();
    }
  },
  {
    name: '3. TINY WHITE INSECTS on leaf (whitefly)',
    create: async () => {
      const base = await sharp({ create: { width: 500, height: 400, channels: 3, background: { r: 55, g: 120, b: 45 } } }).png().toBuffer();
      const whiteSpots = [];
      for (let i = 0; i < 20; i++) {
        whiteSpots.push({
          input: await sharp({ create: { width: 10, height: 8, channels: 3, background: { r: 245, g: 245, b: 240 } } }).png().toBuffer(),
          top: 50 + Math.floor(Math.random() * 300),
          left: 50 + Math.floor(Math.random() * 400)
        });
      }
      return sharp(base).composite(whiteSpots).jpeg({ quality: 85 }).toBuffer();
    }
  },
  {
    name: '4. BROWN CATERPILLAR on corn (armyworm)',
    create: async () => {
      const base = await sharp({ create: { width: 500, height: 400, channels: 3, background: { r: 100, g: 150, b: 50 } } }).png().toBuffer();
      return sharp(base)
        .composite([
          { input: await sharp({ create: { width: 140, height: 35, channels: 3, background: { r: 100, g: 70, b: 30 } } }).png().toBuffer(), top: 180, left: 190 },
          { input: await sharp({ create: { width: 50, height: 40, channels: 3, background: { r: 110, g: 80, b: 40 } } }).png().toBuffer(), top: 100, left: 100 }
        ]).jpeg({ quality: 85 }).toBuffer();
    }
  },
  {
    name: '5. HEALTHY GREEN CROP LEAF (healthy status)',
    create: async () => {
      return sharp({ create: { width: 500, height: 400, channels: 3, background: { r: 45, g: 145, b: 40 } } })
        .jpeg({ quality: 85 }).toBuffer();
    }
  },
  {
    name: '6. HUMAN SELFIE (should reject)',
    create: async () => {
      return sharp({ create: { width: 400, height: 500, channels: 3, background: { r: 210, g: 170, b: 140 } } })
        .jpeg({ quality: 85 }).toBuffer();
    }
  },
  {
    name: '7. LAPTOP/ELECTRONICS (should reject)',
    create: async () => {
      const base = await sharp({ create: { width: 500, height: 400, channels: 3, background: { r: 180, g: 180, b: 185 } } }).png().toBuffer();
      return sharp(base)
        .composite([
          { input: await sharp({ create: { width: 350, height: 220, channels: 3, background: { r: 30, g: 30, b: 35 } } }).png().toBuffer(), top: 40, left: 75 },
        ]).jpeg({ quality: 85 }).toBuffer();
    }
  }
];

async function runTests() {
  console.log('='.repeat(70));
  console.log('  PEST DETECTION SERVICE — LOCAL INTEGRATION TEST');
  console.log('='.repeat(70));
  console.log('');

  const results = [];

  for (const testCase of TEST_CASES) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      console.log('-'.repeat(55));

      const imageBuffer = await testCase.create();
      const tempFile = path.join(__dirname, `test_case_${Date.now()}.jpg`);
      fs.writeFileSync(tempFile, imageBuffer);

      const startTime = Date.now();
      const scanData = await classifyPestImage(tempFile);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      const detected = scanData?.isPestDetected;
      const pestName = scanData?.pest?.name || (scanData?.message ? scanData.message.substring(0, 30) : 'NONE');
      const confidence = scanData?.confidenceScore || 0;
      const harmful = scanData?.isHarmful;

      const status = detected ? '✅ DETECTED' : '🚫 REJECTED / HEALTHY';
      console.log(`   Status:     ${status} (${elapsed}s)`);
      console.log(`   Result:     ${pestName}`);
      console.log(`   Confidence: ${(confidence * 100).toFixed(0)}%`);
      console.log(`   Harmful?:   ${harmful ? '⚠️ YES' : '✅ No / Safe'}`);

      results.push({
        test: testCase.name,
        detected,
        pest: pestName,
        confidence,
        time: elapsed
      });

      try { fs.unlinkSync(tempFile); } catch(e) {}
    } catch (err) {
      console.log(`   ❌ ERROR: ${err.message}`);
      results.push({ test: testCase.name, detected: null, pest: 'ERROR', confidence: 0, time: 0 });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('  RESULTS SUMMARY');
  console.log('='.repeat(70));
  console.log('');
  console.log('  Test Case                                  | Status    | Result / Pest    | Time');
  console.log('  ' + '-'.repeat(68));
  for (const r of results) {
    const name = r.test.substring(0, 42).padEnd(42);
    const result = (r.detected ? 'DETECTED' : r.detected === false ? 'REJECTED' : 'ERROR').padEnd(9);
    const pest = (r.pest || '').substring(0, 16).padEnd(16);
    console.log(`  ${name} | ${result} | ${pest} | ${r.time}s`);
  }
  console.log('');
}

runTests().catch(e => console.error('FATAL:', e.message));
