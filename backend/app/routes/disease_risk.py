import json
import logging
import subprocess
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app

logger = logging.getLogger(__name__)

disease_risk_bp = Blueprint("disease_risk", __name__)

VALID_CROPS = {"Corn", "Potato", "Rice", "Tomato", "Wheat"}
VALID_COLORS = {"Brown", "Green", "Yellow"}


@disease_risk_bp.route("/models/disease-risk/predict", methods=["POST"])
def predict_disease_risk():
    """Execute Crop Disease Risk prediction via R Model inference engine."""
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({
            "error": "Invalid JSON request body. Expected application/json."
        }), 400

    # 1. Field extraction and normalization
    crop = payload.get("crop") or payload.get("Plant_Type")
    leaf_color = payload.get("leaf_color") or payload.get("Leaf_Color")
    leaf_spot_size = payload.get("leaf_spot_size") or payload.get("Leaf_Spot_Size")
    humidity = payload.get("humidity") or payload.get("Humidity")
    temperature = payload.get("temperature") or payload.get("Temperature")

    # 2. Validation
    missing_fields = []
    if crop is None:
        missing_fields.append("crop")
    if leaf_color is None:
        missing_fields.append("leaf_color")
    if leaf_spot_size is None:
        missing_fields.append("leaf_spot_size")
    if humidity is None:
        missing_fields.append("humidity")
    if temperature is None:
        missing_fields.append("temperature")

    if missing_fields:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing_fields)}"
        }), 400

    # Validate categorical types
    crop_str = str(crop).strip()
    if crop_str not in VALID_CROPS:
        return jsonify({
            "error": f"Invalid crop '{crop_str}'. Supported crops: {', '.join(sorted(VALID_CROPS))}"
        }), 400

    color_str = str(leaf_color).strip()
    if color_str not in VALID_COLORS:
        return jsonify({
            "error": f"Invalid leaf color '{color_str}'. Supported colors: {', '.join(sorted(VALID_COLORS))}"
        }), 400

    # Validate numeric types and ranges
    try:
        spot_size_val = float(leaf_spot_size)
        if not (0.0 <= spot_size_val <= 15.0):
            return jsonify({
                "error": "Leaf spot size must be between 0.0 and 15.0 cm."
            }), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Leaf spot size must be a valid number."}), 400

    try:
        humidity_val = float(humidity)
        if not (0.0 <= humidity_val <= 100.0):
            return jsonify({
                "error": "Humidity must be between 0% and 100%."
            }), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Humidity must be a valid number."}), 400

    try:
        temp_val = float(temperature)
        if not (-10.0 <= temp_val <= 60.0):
            return jsonify({
                "error": "Temperature must be between -10°C and 60°C."
            }), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Temperature must be a valid number."}), 400

    # 3. Check model existence
    model_file = Path(current_app.config["DISEASE_MODEL_FILE"])
    script_file = Path(current_app.config["DISEASE_PREDICT_SCRIPT"])

    if not model_file.exists():
        logger.error(f"Disease model bundle not found at {model_file}")
        return jsonify({
            "error": "Disease risk model is currently unavailable. Please ensure model training is complete."
        }), 503

    if not script_file.exists():
        logger.error(f"Prediction script not found at {script_file}")
        return jsonify({
            "error": "Prediction engine script is missing."
        }), 500

    # 4. Invoke R predict script
    clean_input = {
        "crop": crop_str,
        "leaf_color": color_str,
        "leaf_spot_size": spot_size_val,
        "humidity": humidity_val,
        "temperature": temp_val,
    }

    input_json_str = json.dumps(clean_input)
    rscript_cmd = current_app.config["RSCRIPT_PATH"]

    try:
        proc = subprocess.run(
            [rscript_cmd, str(script_file), input_json_str],
            capture_output=True,
            text=True,
            timeout=15,
            check=False,
        )

        if proc.returncode != 0:
            logger.error(f"R script failed with code {proc.returncode}: {proc.stderr}")
            # Check if stderr has JSON error
            try:
                err_data = json.loads(proc.stdout)
                if "error" in err_data:
                    return jsonify({"error": err_data["error"]}), 400
            except Exception:
                pass
            return jsonify({
                "error": "Failed to generate prediction from the machine learning model."
            }), 500

        # Parse R script JSON output
        result_json = json.loads(proc.stdout.strip())
        if "error" in result_json:
            return jsonify({"error": result_json["error"]}), 400

        return jsonify(result_json), 200

    except subprocess.TimeoutExpired:
        logger.error("R inference execution timed out.")
        return jsonify({
            "error": "Model prediction timed out. Please try again."
        }), 504
    except json.JSONDecodeError as exc:
        logger.error(f"Failed to decode R output: {exc} | Raw: {proc.stdout}")
        return jsonify({
            "error": "Invalid output format received from the model inference engine."
        }), 500
    except Exception as exc:
        logger.error(f"Unexpected error during disease risk prediction: {exc}")
        return jsonify({
            "error": "An internal error occurred while processing the prediction."
        }), 500
