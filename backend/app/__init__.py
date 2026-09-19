"""
Flask Application Initialization
"""

from flask import Flask
from flask_cors import CORS
from app.routes.crop_yield import crop_yield_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend
    
    # Register blueprints
    app.register_blueprint(crop_yield_bp)
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "ok", "service": "Smart Agriculture Intelligence API"}, 200

    return app
