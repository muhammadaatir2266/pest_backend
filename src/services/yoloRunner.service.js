const { spawn } = require('child_process');
const path = require('path');
const logger = require('../config/logger');

const YOLO_PORT = process.env.YOLO_PORT || 5001;
const YOLO_SERVICE_URL = `http://127.0.0.1:${YOLO_PORT}`;

let pyProcess = null;
let isStarting = false;

/**
 * Check health of Python YOLO microservice
 */
async function checkYoloHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${YOLO_SERVICE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Microservice not reachable yet
  }
  return null;
}

/**
 * Spawn persistent Python YOLO Microservice process if not already running
 */
async function ensureYoloServiceRunning() {
  const health = await checkYoloHealth();
  if (health) {
    logger.info(`✅ Python YOLO11s Microservice active on port ${YOLO_PORT} (Classes: ${health.classesCount})`);
    return true;
  }

  if (isStarting) return false;
  isStarting = true;

  logger.info('🚀 Spawning Python YOLO11s persistent microservice process...');
  const scriptPath = path.join(__dirname, '../../python_service/yolo_detector.py');

  // Spawn background Python process
  pyProcess = spawn('python', [scriptPath], {
    env: { ...process.env, YOLO_PORT: YOLO_PORT.toString() },
    stdio: 'inherit',
    detached: false
  });

  pyProcess.on('error', (err) => {
    logger.error(`Failed to start Python YOLO process: ${err.message}`);
    isStarting = false;
  });

  pyProcess.on('exit', (code) => {
    logger.warn(`Python YOLO process exited with code ${code}`);
    isStarting = false;
    pyProcess = null;
  });

  // Wait up to 15 seconds for model to load into memory
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const healthy = await checkYoloHealth();
    if (healthy) {
      logger.info('✅ Python YOLO11s microservice ready for inference!');
      isStarting = false;
      return true;
    }
  }

  isStarting = false;
  return false;
}

/**
 * Send image path to Python YOLO11s microservice for detection
 * @param {string} imagePath - Absolute path to image
 * @param {number} threshold - Confidence threshold (default 0.50)
 */
async function detectPestWithYolo(imagePath, threshold = 0.50) {
  const isReady = await ensureYoloServiceRunning();
  if (!isReady) {
    logger.warn('YOLO service not ready or failed to start, falling back...');
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${YOLO_SERVICE_URL}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imagePath,
        threshold: parseFloat(threshold)
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errText = await response.text();
      logger.warn(`YOLO service HTTP ${response.status}: ${errText}`);
    }
  } catch (err) {
    logger.error(`Error communicating with YOLO microservice: ${err.message}`);
  }

  return null;
}

module.exports = {
  ensureYoloServiceRunning,
  detectPestWithYolo
};
