"""
Irrigation Requirement Prediction — Flask API Route
Person 5

POST /api/models/irrigation/predict

Accepts 19 features, calls the trained R model via Rscript,
returns classification result with probabilities.
"""

import json
import os
import subprocess
import tempfile

from flask import Blueprint, jsonify, request

irrigation_bp = Blueprint("irrigation", __name__)

# --- Constants ---------------------------------------------------------------

# Path to the R predict script (relative to project root)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
R_PREDICT_SCRIPT = os.path.join(BASE_DIR, "models", "irrigation", "R", "predict.R")

# The 19 input features and their expected types
NUMERIC_FIELDS = [
    "Soil_pH",
    "Soil_Moisture",
    "Organic_Carbon",
    "Electrical_Conductivity",
    "Temperature_C",
    "Humidity",
    "Rainfall_mm",
    "Sunlight_Hours",
    "Wind_Speed_kmh",
    "Field_Area_hectare",
    "Previous_Irrigation_mm",
]

CATEGORICAL_FIELDS = {
    "Soil_Type": ["Clay", "Loamy", "Sandy", "Silt"],
    "Crop_Type": ["Cotton", "Maize", "Potato", "Rice", "Sugarcane", "Wheat"],
    "Crop_Growth_Stage": ["Flowering", "Harvest", "Sowing", "Vegetative"],
    "Season": ["Kharif", "Rabi", "Zaid"],
    "Irrigation_Type": ["Canal", "Drip", "Rainfed", "Sprinkler"],
    "Water_Source": ["Groundwater", "Rainwater", "Reservoir", "River"],
    "Mulching_Used": ["No", "Yes"],
    "Region": ["Central", "East", "North", "South", "West"],
}

ALL_FIELDS = NUMERIC_FIELDS + list(CATEGORICAL_FIELDS.keys())


# --- Validation helpers ------------------------------------------------------

def validate_request(data: dict) -> list[str]:
    """Return a list of validation error strings (empty = valid)."""
    errors: list[str] = []

    if not isinstance(data, dict):
        return ["Request body must be a JSON object."]

    # Check required fields
    for field in ALL_FIELDS:
        if field not in data:
            errors.append(f"Missing required field: '{field}'.")

    if errors:
        return errors  # stop early if fields are missing

    # Validate numeric fields
    for field in NUMERIC_FIELDS:
        val = data[field]
        if not isinstance(val, (int, float)):
            errors.append(
                f"Field '{field}' must be numeric, got {type(val).__name__}."
            )

    # Validate categorical fields
    for field, allowed in CATEGORICAL_FIELDS.items():
        val = data[field]
        if val not in allowed:
            errors.append(
                f"Field '{field}' must be one of {allowed}, got '{val}'."
            )

    return errors


# --- Route -------------------------------------------------------------------

@irrigation_bp.route("/api/models/irrigation/predict", methods=["POST"])
def predict_irrigation():
    """Handle irrigation prediction request."""

    # Parse JSON body
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    # Validate
    errors = validate_request(data)
    if errors:
        return jsonify({"error": "Validation failed.", "details": errors}), 400

    # Build input for R script
    input_payload = {}
    for field in ALL_FIELDS:
        input_payload[field] = data[field]

    # Write to temp JSON file
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".json", delete=False
        ) as tmp:
            json.dump(input_payload, tmp)
            tmp_path = tmp.name

        # Call Rscript
        result = subprocess.run(
            ["Rscript", R_PREDICT_SCRIPT, tmp_path],
            capture_output=True,
            text=True,
            timeout=30,
        )

        if result.returncode != 0:
            return jsonify({
                "error": "Model prediction failed.",
                "details": result.stderr.strip(),
            }), 500

        # Parse R output (JSON printed to stdout)
        output = result.stdout.strip()
        prediction = json.loads(output)

        return jsonify(prediction), 200

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Model prediction timed out."}), 504
    except json.JSONDecodeError:
        return jsonify({
            "error": "Failed to parse model output.",
            "details": result.stdout.strip() if result else "",
        }), 500
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    finally:
        # Clean up temp file
        if "tmp_path" in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)
