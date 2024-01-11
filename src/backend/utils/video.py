import os
from base64 import b64decode
import subprocess

# Asynchronous function to generate a video from a sequence of images
async def generate_video(images, capture_id, x, y):
    # Define the output directory for images
    output_dir = f"../../outputs/{capture_id}/images"
    os.makedirs(output_dir, exist_ok=True)

    print(len(images))

    # Save each image to the output directory
    for image in sorted(images, key=lambda x: x['node']):
        print(f"Saving image for node {image['node']}")
        img_data = b64decode(image['imgData'])
        with open(f"{output_dir}/capture-{image['node']}.jpg", "wb") as img_file:
            img_file.write(img_data)

    # Configuration for ffmpeg
    config = {
        'framerate': 6,
        'resolution': f'{x}x{y}',
    }

    # Construct the ffmpeg command for creating the video
    args = [
        'ffmpeg',
        '-r', str(config['framerate']),
        '-s', config['resolution'],
        '-start_number', '101',
        '-i', f'{output_dir}/capture-btns-node-%03d.jpg',
        '-c:v', 'libx264',
        '-vcodec', 'h264',
        '-strict', '-2',
        '-crf', '25',
        f'../../outputs/{capture_id}/preview.mp4',
    ]

    command = ' '.join(args)

    try:
        # Run the ffmpeg command to create the initial video
        subprocess.run(command, check=False, shell=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE) 

        return "Video generated successfully"
    except subprocess.CalledProcessError as e:
        print(e)
        return "Unable to generate video"