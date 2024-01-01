import os
from base64 import b64decode
import subprocess

async def generate_video(images, capture_id, x, y):
    output_dir = f"./outputs/{capture_id}/images"
    os.makedirs(output_dir, exist_ok=True)

    index = 1
    for image in images:
        img_data = b64decode(image['imgData'])
        with open(f"{output_dir}/capture-{image['node']}.jpg", "wb") as img_file:
            img_file.write(img_data)
        index += 1

    config = {
        'framerate': 6,
        'resolution': f'{x}x{y}',
    }

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
        f'./outputs/{capture_id}/output.mp4',
    ]

    command = ' '.join(args)

    try:
        subprocess.run(command, check=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return "Video generated successfully"
    except subprocess.CalledProcessError as e:
        print(e)
        return "Unable to generate video"