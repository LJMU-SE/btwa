# Create a Flask Blueprint for processing-related routes
from flask import Blueprint
processing_blueprint = Blueprint('process', __name__)

# Import processing_routes to associate the routes with the processing_blueprint
from . import processing_routes