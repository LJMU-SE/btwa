import os
import uuid
from . import processing_blueprint
from flask import request, jsonify

# Import utility functions for video generation and database interaction
from utils import video
from utils import database

# Define the route '/api/processing/360' with the HTTP method POST
@processing_blueprint.route('/360', methods=["POST"])
async def process_360():
    # Generate a unique capture_id using UUID
    capture_id = str(uuid.uuid4())

    try:
        # Retrieve necessary data from the request JSON body
        body = request.json
        images = body['images']
        x = body['x']
        y = body['y']
        capture_type = body['type']
        email = body['email']
        name = body['name']

        # Create the directory to store images for the capture
        os.makedirs(f"../../outputs/{capture_id}/images", exist_ok=True)

        # Generate the video using the provided images and dimensions
        await video.generate_video(images, capture_id, x, y)

        # Save capture details to the database
        database.save_capture(capture_id, email, f"{x} x {y}", capture_type, name)

        print("🟢 | Video Render Finished")
        
        # Return success response with capture_id
        return jsonify({
            "status": 200,
            "message": "Video Render Successful",
            "id": capture_id,
        })
    except Exception as e:
        # Handle exceptions during video rendering
        print(f"🔴 | Error during video rendering: {e}")
        
        # Remove capture directory if it was created before encountering an error
        if capture_id:
            os.system(f"../../outputs/{capture_id}")
        
        # Return error response with details
        return jsonify({
            "status": 500,
            "message": "Video Render Failed",
            "error": str(e),
        })
