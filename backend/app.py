"""
Smart Agriculture Intelligence Dashboard — Flask Backend
Entry point: python app.py
"""

from flask import Flask
from flask_cors import CORS

from app.routes.irrigation import irrigation_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(irrigation_bp)
    return app


if __name__ == "__main__":
    app = create_app()
    print("🌿 Flask backend starting on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)
