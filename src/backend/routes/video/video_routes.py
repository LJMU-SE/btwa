from . import video_blueprint
from flask import send_from_directory

# Define the route '/api/video/preview/<id>' with the HTTP method GET
@video_blueprint.route('/preview/<id>', methods=["GET"])
async def preview(id):
    # Return the 'preview.mp4' file from the specified directory
    return send_from_directory(f"../../outputs/{id}", "preview.mp4")
