import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Config:
    """Central configuration for Flask Backend."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "smart-agri-secret-key-2025")
    DEBUG = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    PORT = int(os.environ.get("PORT", 5001))
    HOST = os.environ.get("HOST", "0.0.0.0")

    # R Script and Model paths
    RSCRIPT_PATH = os.environ.get("RSCRIPT_PATH", "Rscript")
    DISEASE_MODEL_DIR = os.environ.get(
        "DISEASE_MODEL_DIR", str(BASE_DIR / "models" / "disease_risk")
    )
    DISEASE_PREDICT_SCRIPT = os.environ.get(
        "DISEASE_PREDICT_SCRIPT",
        str(BASE_DIR / "models" / "disease_risk" / "R" / "predict.R"),
    )
    DISEASE_MODEL_FILE = os.environ.get(
        "DISEASE_MODEL_FILE",
        str(BASE_DIR / "models" / "disease_risk" / "model" / "disease_model.rds"),
    )

    # Allowed CORS origins
    CORS_ORIGINS = os.environ.get(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    ).split(",")
