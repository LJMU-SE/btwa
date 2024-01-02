# Create a Flask Blueprint for admin-related routes
from flask import Blueprint
admin_blueprint = Blueprint('amdin', __name__)

# Import admin_routes to associate the routes with the admin_blueprint
from . import admin_routes