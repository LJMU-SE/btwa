from flask import Flask
from processing import processing_blueprint

app = Flask(__name__)

app.register_blueprint(processing_blueprint, url_prefix="/api/processing")

if __name__ == "__main__":
    app.run(port=5328)