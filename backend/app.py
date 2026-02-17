from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize the model pipeline
logger.info("Loading plant disease detection model...")
try:
    image_processor = AutoImageProcessor.from_pretrained("linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")
    model = AutoModelForImageClassification.from_pretrained("linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")
    model.eval()
    logger.info("Model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    image_processor = None
    model = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict plant disease from uploaded image
    Expects: multipart/form-data with 'image' file
    Returns: JSON with disease predictions
    """
    try:
        # Check if model is loaded
        if image_processor is None or model is None:
            return jsonify({
                'error': 'Model not loaded. Please restart the server.'
            }), 503

        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided'
            }), 400

        file = request.files['image']
        
        # Check if file is empty
        if file.filename == '':
            return jsonify({
                'error': 'Empty filename'
            }), 400

        # Read and process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        logger.info(f"Processing image: {file.filename}")
        
        # Run prediction
        # Resize to model expected size and normalize to [-1, 1]
        resized = image.resize((224, 224))

        # Convert PIL image to tensor using pure PyTorch (no NumPy dependency)
        img_bytes = resized.tobytes()
        img_tensor = torch.ByteTensor(torch.ByteStorage.from_buffer(img_bytes))
        img_tensor = img_tensor.view(resized.height, resized.width, 3).float() / 255.0
        img_tensor = (img_tensor - 0.5) / 0.5
        pixel_values = img_tensor.permute(2, 0, 1).unsqueeze(0)

        with torch.no_grad():
            outputs = model(pixel_values=pixel_values)
            logits = outputs.logits[0]
            probabilities = torch.nn.functional.softmax(logits, dim=-1)

        scores = probabilities.tolist()
        id2label = model.config.id2label
        results = [
            {"label": id2label[i], "score": float(scores[i])}
            for i in range(len(scores))
        ]
        results.sort(key=lambda x: x["score"], reverse=True)
        
        logger.info(f"Prediction complete: {results[0]['label']}")
        
        return jsonify({
            'success': True,
            'predictions': results,
            'top_prediction': results[0] if results else None
        })

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': f'Error processing image: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
