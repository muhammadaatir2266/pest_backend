import os
import sys
import json
import time
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler

# Headless & Offscreen environment flags
os.environ["QT_QPA_PLATFORM"] = "offscreen"
os.environ["OPENCV_HEADLESS"] = "1"

# Handle cv2 import gracefully if Linux shared GUI libraries (libxcb.so.1, libGL.so.1) are absent
try:
    import cv2
except ImportError as cv_err:
    print(f"⚠️ Warning: Native cv2 import failed ({cv_err}). Using MagicMock + Pillow interceptor for headless YOLO execution.")
    from unittest.mock import MagicMock
    import numpy as np
    from PIL import Image

    mock_cv2 = MagicMock()
    mock_cv2.__file__ = "mock_cv2"

    def imread(filename, flags=1):
        with Image.open(filename) as img:
            arr = np.array(img.convert("RGB"))
            return arr[:, :, ::-1].copy()

    def imwrite(filename, img, params=None):
        if isinstance(img, np.ndarray):
            rgb_img = img[:, :, ::-1] if len(img.shape) == 3 and img.shape[2] == 3 else img
            Image.fromarray(rgb_img).save(filename)
            return True
        return False

    def imdecode(buf, flags=1):
        import io
        with Image.open(io.BytesIO(buf)) as img:
            arr = np.array(img.convert("RGB"))
            return arr[:, :, ::-1].copy()

    def imshow(winname, mat):
        pass

    def cvtColor(src, code, dst=None):
        return src

    def resize(src, dsize, dst=None, fx=0, fy=0, interpolation=0):
        if isinstance(src, np.ndarray):
            h, w = src.shape[:2]
            target_w, target_h = dsize
            if (w, h) == (target_w, target_h):
                return src
            img = Image.fromarray(src)
            img = img.resize((target_w, target_h))
            return np.array(img)
        return src

    def rectangle(img, pt1, pt2, color, thickness=1, lineType=8, shift=0):
        return img

    def putText(img, text, org, fontFace, fontScale, color, thickness=1, lineType=8, bottomLeftOrigin=False):
        return img

    def getTextSize(text, fontFace, fontScale, thickness):
        return (len(str(text)) * 10, 20), 5

    def line(img, pt1, pt2, color, thickness=1, lineType=8, shift=0):
        return img

    def polylines(img, pts, isClosed, color, thickness=1, lineType=8, shift=0):
        return img

    mock_cv2.imread = imread
    mock_cv2.imwrite = imwrite
    mock_cv2.imdecode = imdecode
    mock_cv2.imshow = imshow
    mock_cv2.cvtColor = cvtColor
    mock_cv2.resize = resize
    mock_cv2.rectangle = rectangle
    mock_cv2.putText = putText
    mock_cv2.getTextSize = getTextSize
    mock_cv2.line = line
    mock_cv2.polylines = polylines

    mock_cv2.IMREAD_COLOR = 1
    mock_cv2.IMREAD_UNCHANGED = -1
    mock_cv2.COLOR_BGR2RGB = 4
    mock_cv2.COLOR_RGB2BGR = 4
    mock_cv2.INTER_LINEAR = 1
    mock_cv2.INTER_AREA = 3
    mock_cv2.FONT_HERSHEY_SIMPLEX = 0
    mock_cv2.LINE_AA = 16

    sys.modules["cv2"] = mock_cv2

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
            with Image.open(image_path) as raw_img:
                pil_rgb = raw_img.convert("RGB")
                results = model(pil_rgb, conf=conf_threshold, verbose=False)
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
