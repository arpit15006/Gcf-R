"""
Flask REST API route for Crop Yield Prediction (PERSON 3).
Endpoint: POST /api/models/crop-yield/predict
"""

import os
import sys
import json
import subprocess
from flask import Blueprint, request, jsonify

crop_yield_bp = Blueprint('crop_yield', __name__)

# Base directory paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
R_PREDICT_SCRIPT = os.path.join(BASE_DIR, 'models', 'crop_yield', 'R', 'predict.R')

def get_rscript_command():
    """Find available Rscript binary executable."""
    # Check system PATH
    import shutil
    if shutil.which("Rscript"):
        return ["Rscript"]
    
    # Check micromamba crop-env path
    home = os.path.expanduser("~")
    micromamba_bin = os.path.join(home, ".local", "bin", "micromamba")
    if os.path.exists(micromamba_bin):
        return [micromamba_bin, "run", "-n", "crop-env", "Rscript"]
    
    # Fallback to direct Rscript path in micromamba env
    rscript_env_bin = os.path.join(home, ".local", "share", "mamba", "envs", "crop-env", "bin", "Rscript")
    if os.path.exists(rscript_env_bin):
        return [rscript_env_bin]
        
    return ["Rscript"]

@crop_yield_bp.route('/api/models/crop-yield/predict', methods=['POST'])
def predict_crop_yield():
    """
    POST /api/models/crop-yield/predict
    Request Body:
    {
        "rainfall": 1200.0,
        "fertilizer": 75.0,
        "temperature": 28.0,
        "nitrogen": 80.0,
        "phosphorus": 25.0,
        "potassium": 20.0
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "status": "error",
                "message": "Invalid or missing JSON payload in request body."
            }), 400

        required_fields = ["rainfall", "fertilizer", "temperature", "nitrogen", "phosphorus", "potassium"]
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]

        if missing_fields:
            return jsonify({
                "status": "error",
                "message": f"Missing required input fields: {', '.join(missing_fields)}"
            }), 400

        # Validate numeric types
        numeric_data = {}
        for field in required_fields:
            try:
                val = float(data[field])
                if val < 0 and field != "temperature":
                    return jsonify({
                        "status": "error",
                        "message": f"Field '{field}' cannot be negative."
                    }), 400
                numeric_data[field] = val
            except (ValueError, TypeError):
                return jsonify({
                    "status": "error",
                    "message": f"Field '{field}' must be a valid numeric value."
                }), 400

        # Check script existence
        if not os.path.exists(R_PREDICT_SCRIPT):
            return jsonify({
                "status": "error",
                "message": f"R prediction script not found at {R_PREDICT_SCRIPT}."
            }), 500

        # Prepare Rscript command
        r_cmd = get_rscript_command() + [R_PREDICT_SCRIPT, json.dumps(numeric_data)]

        # Run R script subprocess
        result = subprocess.run(
            r_cmd,
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode != 0:
            stderr_msg = result.stderr.strip() or result.stdout.strip() or "Unknown Rscript error"
            return jsonify({
                "status": "error",
                "message": f"R prediction execution failed: {stderr_msg}"
            }), 500

        # Parse R script output JSON
        output_data = json.loads(result.stdout)
        return jsonify(output_data), 200

    except subprocess.TimeoutExpired:
        return jsonify({
            "status": "error",
            "message": "Prediction request timed out."
        }), 504
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"An error occurred during prediction: {str(e)}"
        }), 500
