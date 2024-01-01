import os
import uuid
from . import processing_blueprint
from flask import request, jsonify

from utils import video
from utils import database

@processing_blueprint.route('/360', methods=["POST"])
def capture_handler():
    capture_id = str(uuid.uuid4())

    try:
        body = request.json
        images = body['images']
        x = body['x']
        y = body['y']
        capture_type = body['type']
        email = body['email']
        name = body['name']

        os.makedirs(f"./outputs/{capture_id}/images", exist_ok=True)

        # video.generate_video(images, capture_id, x, y)
        # database.save_capture(capture_id, email, f"{x} x {y}", capture_type, name)

        print("🟢 | Video Render Finished")
        return jsonify({
            "status": 200,
            "message": "Video Render Successful",
            "id": capture_id,
        })
    except Exception as e:
        print(f"🔴 | Error during video rendering: {e}")
        if capture_id:
            os.system(f"rm -r ./outputs/{capture_id}")
        return jsonify({
            "status": 500,
            "message": "Video Render Failed",
            "error": str(e),
        })