import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", app.config.get("PORT", 5001)))
    host = os.environ.get("HOST", app.config.get("HOST", "0.0.0.0"))
    debug = os.environ.get("FLASK_DEBUG", str(app.config.get("DEBUG", True))).lower() in ("true", "1", "yes")

    print(f"🌾 Starting Smart Agriculture Flask API on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
