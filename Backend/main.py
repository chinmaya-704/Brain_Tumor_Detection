import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# -------------------------
# Path to model
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # Backend/
MODEL_PATH = os.path.join(BASE_DIR, "Brain_6.h5")         # Backend/Brain.h5

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

# -------------------------
# Load model
# -------------------------
try:
    print(f"Loading model from: {MODEL_PATH}")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

tumors = {
    0: "Glioma",
    1: "Meningioma",
    2: "No Tumor",
    3: "Pituitary Tumor"
}

def preprocess_image(image):
    image = image.convert("RGB")
    image = image.resize((299, 299))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.route("/")
def start():
    return "Server is running!"

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        processed = preprocess_image(image)

        predictions = model.predict(processed)
        predicted_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))

        return jsonify({
            "class_index": predicted_index,
            "class": tumors.get(predicted_index, "Unknown"),
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": f"Prediction error: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
