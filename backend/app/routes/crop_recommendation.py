"""
Flask REST API Route for Crop Recommendation ML Model (PERSON 2)
Endpoint: POST /api/models/crop-recommendation/predict

Delegates ML inference to Rscript (models/crop_recommendation/R/predict.R)
without moving R machine learning logic into Python.
"""

import os
import sys
import json
import subprocess
from flask import Blueprint, request, jsonify

crop_recommendation_bp = Blueprint('crop_recommendation', __name__, url_prefix='/api/models/crop-recommendation')

def get_rscript_path():
    """Locate full absolute path to predict.R script."""
    # Base path assuming project root
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # backend/app/routes -> backend -> root
    root_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
    
    predict_script = os.path.join(root_dir, "models", "crop_recommendation", "R", "predict.R")
    if not os.path.exists(predict_script):
        # Fallback relative to current working directory
        predict_script = os.path.abspath("models/crop_recommendation/R/predict.R")
        
    return predict_script

@crop_recommendation_bp.route('/predict', methods=['POST'])
def predict_crop():
    """
    Predict recommended crop based on soil and weather parameters.
    Expected Payload:
    {
        "N": float/int,
        "P": float/int,
        "K": float/int,
        "temperature": float,
        "humidity": float,
        "ph": float,
        "rainfall": float
    }
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({
                "success": False,
                "error": "Invalid request: Payload must be valid JSON."
            }), 400

        required_fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]

        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Missing required parameters: {', '.join(missing_fields)}"
            }), 400

        # Extract values
        try:
            N = float(data["N"])
            P = float(data["P"])
            K = float(data["K"])
            temperature = float(data["temperature"])
            humidity = float(data["humidity"])
            ph = float(data["ph"])
            rainfall = float(data["rainfall"])
        except (ValueError, TypeError) as val_err:
            return jsonify({
                "success": False,
                "error": f"Invalid parameter data type: {str(val_err)}"
            }), 400

        # Get absolute path to R prediction script
        predict_script = get_rscript_path()
        if not os.path.exists(predict_script):
            return jsonify({
                "success": False,
                "error": f"R script artifact not found at {predict_script}"
            }), 500

        # Invoke Rscript subprocess passing numerical features
        cmd = [
            "Rscript",
            predict_script,
            str(N),
            str(P),
            str(K),
            str(temperature),
            str(humidity),
            str(ph),
            str(rainfall)
        ]

        # Execute R subprocess safely
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=30
        )

        if result.returncode != 0:
            stderr_msg = result.stderr.strip() or result.stdout.strip()
            return jsonify({
                "success": False,
                "error": f"R execution failed: {stderr_msg}"
            }), 500

        # Parse R script JSON output
        try:
            r_output = json.loads(result.stdout.strip())
            return jsonify(r_output), 200
        except json.JSONDecodeError as json_err:
            return jsonify({
                "success": False,
                "error": f"Failed to parse R output JSON: {str(json_err)}",
                "raw_output": result.stdout
            }), 500

    except Exception as exc:
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(exc)}"
        }), 500
