import os
from base64 import b64decode
import subprocess
from vidstab.VidStab import VidStab

# Asynchronous function to generate a video from a sequence of images
async def generate_video(images, capture_id, x, y):
    # Define the output directory for images
    output_dir = f"../../outputs/{capture_id}/images"
    os.makedirs(output_dir, exist_ok=True)

    index = 1
    # Save each image to the output directory
    for image in images:
        img_data = b64decode(image['imgData'])
        with open(f"{output_dir}/capture-{image['node']}.jpg", "wb") as img_file:
            img_file.write(img_data)
        index += 1

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
        f'../../outputs/{capture_id}/output.mp4',
    ]

    command = ' '.join(args)

    try:
        # Run the ffmpeg command to create the initial video
        subprocess.run(command, check=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Stabilize the video using VidStab
        stabilise_video(input_file=f"../../outputs/{capture_id}/output.mp4", output_file=f"../../outputs/{capture_id}/preview.avi")
        
        # Convert the stabilized video to mp4 format
        subprocess.run(f"ffmpeg -i ../../outputs/{capture_id}/preview.avi -c:v libx264 ../../outputs/{capture_id}/preview.mp4", check=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Remove the intermediate AVI file
        os.remove(f"../../outputs/{capture_id}/preview.avi")    

        return "Video generated successfully"
    except subprocess.CalledProcessError as e:
        print(e)
        return "Unable to generate video"

# Function to stabilize a video using VidStab
def stabilise_video(input_file, output_file):
    if not input_file:
        raise Exception("\"input_file\" is a required argument.")
    
    if not output_file:
        raise Exception("\"output_file\" is a required argument")

    print("\nStabilising video at path:", input_file)

    # VidStab configuration
    border_type = "reflect"
    smoothing_window = 3

    stabiliser = VidStab()

    # Perform video stabilization
    stabiliser.stabilize(input_path=input_file, output_path=output_file, smoothing_window=smoothing_window, border_type=border_type)
