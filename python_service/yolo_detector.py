import os
import sys
import json
import time
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler
from ultralytics import YOLO

# Environment Configuration
MODEL_PATH_OR_URL = os.environ.get(
    "YOLO_MODEL_URL",
    "https://huggingface.co/underdogquality/yolo11s-pest-detection/resolve/main/best.pt"
)
DEFAULT_CONF_THRESHOLD = float(os.environ.get("YOLO_CONF_THRESHOLD", "0.50"))
PORT = int(os.environ.get("YOLO_PORT", "5001"))

print("=" * 70)
print("🚀 INITIALIZING YOLO11s PEST DETECTION SERVICE")
print(f"   Model Target: {MODEL_PATH_OR_URL}")
print(f"   Default Confidence Threshold: {DEFAULT_CONF_THRESHOLD}")
print("=" * 70)

# Load model ONCE into memory during startup
start_time = time.time()
try:
    model = YOLO(MODEL_PATH_OR_URL)
    load_duration = time.time() - start_time
    print(f"✅ YOLO11s Model loaded & cached successfully in {load_duration:.2f}s!")
    print(f"   Total Classes: {len(model.names)}")
except Exception as e:
    print(f"❌ ERROR: Failed to load YOLO model: {e}")
    traceback.print_exc()
    sys.exit(1)

class YoloDetectionHandler(BaseHTTPRequestHandler):

    def _set_json_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_json_headers(200)

    def do_GET(self):
        if self.path == '/health':
            self._set_json_headers(200)
            res = {
                "status": "ok",
                "service": "YOLO11s Pest Detection Engine",
                "model": MODEL_PATH_OR_URL,
                "classesCount": len(model.names),
                "defaultThreshold": DEFAULT_CONF_THRESHOLD
            }
            self.wfile.write(json.dumps(res).encode('utf-8'))
        else:
            self._set_json_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        if self.path != '/detect':
            self._set_json_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))
            return

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode('utf-8'))
            image_path = payload.get('imagePath')
            conf_threshold = float(payload.get('threshold', DEFAULT_CONF_THRESHOLD))

            if not image_path or not os.path.exists(image_path):
                self._set_json_headers(400)
                res = {"success": False, "message": f"Image file not found: {image_path}"}
                self.wfile.write(json.dumps(res).encode('utf-8'))
                return

            infer_start = time.time()
            results = model(image_path, conf=conf_threshold, verbose=False)
            infer_time = time.time() - infer_start

            detections = []
            if results and len(results) > 0:
                boxes = results[0].boxes
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    cls_name = model.names.get(cls_id, f"pest_class_{cls_id}")
                    conf = float(box.conf[0].item())
                    xyxy = box.xyxy[0].tolist() # [x1, y1, x2, y2] in pixels

                    detections.append({
                        "classId": cls_id,
                        "className": cls_name,
                        "confidence": round(conf, 4),
                        "boundingBox": [round(val, 2) for val in xyxy]
                    })

            # Sort detections by highest confidence
            detections.sort(key=lambda d: d["confidence"], reverse=True)

            is_pest_detected = len(detections) > 0

            response_data = {
                "success": True,
                "isPestDetected": is_pest_detected,
                "thresholdUsed": conf_threshold,
                "inferenceTimeSeconds": round(infer_time, 4),
                "totalDetectionsCount": len(detections),
                "topDetection": detections[0] if is_pest_detected else None,
                "allDetections": detections,
                "message": "Pest detected successfully" if is_pest_detected else f"No pest detected above confidence threshold ({conf_threshold:.2f})"
            }

            self._set_json_headers(200)
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as err:
            print(f"❌ Error during YOLO inference: {err}")
            traceback.print_exc()
            self._set_json_headers(500)
            res = {"success": False, "error": str(err)}
            self.wfile.write(json.dumps(res).encode('utf-8'))

    def log_message(self, format, *args):
        # Suppress verbose standard HTTP request logs to keep terminal clean
        pass

def run_server():
    server_address = ('127.0.0.1', PORT)
    httpd = HTTPServer(server_address, YoloDetectionHandler)
    print(f"⚡ YOLO11s Detection Microservice listening on http://127.0.0.1:{PORT}")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down YOLO microservice.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
