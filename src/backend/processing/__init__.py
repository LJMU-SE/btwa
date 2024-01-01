# auth/__init__.py
from flask import Blueprint

processing_blueprint = Blueprint('process', __name__)

from . import processing_routes
