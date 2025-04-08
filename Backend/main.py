import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from flask import Flask, request, jsonify
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
from googleapiclient.http import MediaIoBaseDownload
import tensorflow as tf
import numpy as np
from PIL import Image
from flask_cors import CORS  
import io

import json

creds_str = os.environ.get('GOOGLE_CREDS_JSON')

SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'Backend/model/maximal-quanta-439006-d3-2e6bb58cedfb.json'  
FILE_ID = '18mYD5-5Lchuc4ScByJwh3hY3TMBv5kzB'


app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}}) 

def download_model_from_drive():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    drive_service = build('drive', 'v3', credentials=creds)

    request = drive_service.files().get_media(fileId=FILE_ID)
    file_data = io.BytesIO()
    downloader = MediaIoBaseDownload(file_data, request)

    done = False
    while not done:
        status, done = downloader.next_chunk()

    model_path = "Brain_6.h5"
    with open(model_path, "wb") as f:
        f.write(file_data.getvalue())
    return model_path

try:
    model_path = download_model_from_drive()
except Exception as e:
    print(f"Error: {e}")
model = tf.keras.models.load_model(model_path)

tumors={0:'Glioma', 1:'Meningioma', 3:'Pituitary Tumor', 2:'No Tumor'}

def preprocess_image(image):
    image = image.convert("RGB")  
    image = image.resize((299,299))  
    image = np.array(image) / 255.0  
    image = np.expand_dims(image, axis=0)  
    return image

@app.route('/')
def start():
    return "Server is running!"


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")  # Convert to RGB
    processed_image = preprocess_image(image)
    
    predictions = model.predict(processed_image)
    predicted_class = int(np.argmax(predictions))
    confidence = float(np.max(predictions))
    
    return jsonify({"class": tumors[int(predicted_class)], "confidence": confidence})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
