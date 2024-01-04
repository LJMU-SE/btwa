from flask import Flask
from routes.processing import processing_blueprint
from routes.video import video_blueprint
from routes.admin import admin_blueprint
from flask_cors import CORS

# Create a Flask application instance
app = Flask(__name__)
CORS(app, origins="*")

# Adjust timeout to allow for the update route to complete
app.config['TIMEOUT'] = 300

# Register the processing blueprint with the application, setting the URL prefix
app.register_blueprint(processing_blueprint, url_prefix="/api/processing")

# Register the video blueprint with the application, setting the URL prefix
app.register_blueprint(video_blueprint, url_prefix="/api/video")

# Register the admin blueprint with the application, setting the URL prefix
app.register_blueprint(admin_blueprint, url_prefix="/api/admin")

# Status Route
@app.route("/status", methods=["GET"])
def status():
    return {"message": "API Is Online"}

# Run the Flask application
if __name__ == "__main__":
    # Set the port for the Flask application to run on
    app.run(port=5328)