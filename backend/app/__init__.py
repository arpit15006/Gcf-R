import logging
from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)


def create_app(config_class=Config):
    """Application factory for Flask backend."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend integration
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
    )

    # Register modular blueprints
    from .routes.health import health_bp
    from .routes.disease_risk import disease_risk_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(disease_risk_bp, url_prefix="/api")

    # Global 404 & 500 error handlers
    @app.errorhandler(404)
    def not_found_handler(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error_handler(e):
        return jsonify({"error": "Internal server error"}), 500

    return app
