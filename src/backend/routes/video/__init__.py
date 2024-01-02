# Create a Flask Blueprint for video-related routes
from flask import Blueprint
video_blueprint = Blueprint('video', __name__)

# Import video_routes to associate the routes with the video_blueprint
from . import video_routes