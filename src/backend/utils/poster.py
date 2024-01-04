import cv2
import numpy as np
import os

template_path = f"LJMU_bullet_time_poster_template.png"

# Limit to 40 frames for an even 5x8 grid
total_frames = 40

# Will have to be tinkered with depending on template size
combined_frames_width = 2125
combined_frames_height = 1235

# Calculate the size of each frame
columns = 5
rows = 8
border_size = 3
frame_width = combined_frames_width // columns
frame_height = combined_frames_height // rows

async def generate_poster(capture_id):

    io_paths = {
        'input': f"../../outputs/{capture_id}/images",
        'output' : f"../../outputs/{capture_id}/poster"
    }
    os.makedirs(io_paths['output'], exist_ok=True)

    # Combine frames into one image
    combined_frames = combine_frames(io_paths['input'])

    if not os.path.exists(template_path):
        return f"Could not find template at {template_path}"
        
    background = cv2.imread(template_path)

    # Specify the coordinates to paste the combined frames onto the background
    start_y = 347
    end_y = start_y + combined_frames_height

    start_x = 188
    end_x = start_x + combined_frames_width  

    # Paste the combined frames onto the background at the specified position
    try:
        background[start_y:end_y, start_x:end_x] = combined_frames
        # Save poster and combined frames
        cv2.imwrite(f"{io_paths['output']}/poster_image.jpg", background)
        cv2.imwrite(f"{io_paths['output']}/combined_frames.jpg", combined_frames)

    except Exception as e:
        return f"Error combining frames with template : {e}"

    return "Poster generation successful!"

def combine_frames(input_dir):

    # Initialize an empty canvas 
    canvas = np.zeros((combined_frames_height, combined_frames_width, 3), dtype=np.uint8)

    node = 101
    frames_combined = 0

    for i in range(total_frames):

        frame_path = f"{input_dir}/capture-btns-node-{node}.jpg"

        if os.path.exists(frame_path):
            
            # Calculate the row index 
            row_index = i // columns

            # Calculate the column index 
            column_index = i % columns

            # Calculate the position of each frame
            x = column_index * frame_width
            y = row_index * frame_height

            # Read frame into memory and resize to match grid
            frame = cv2.imread(f"{input_dir}/capture-btns-node-{node}.jpg")
            frame = cv2.resize(frame, (frame_width - 2 * border_size, frame_height - 2 * border_size))

            # Add a border to the frame and paste the frame onto the canvas
            frame = cv2.copyMakeBorder(frame, border_size, border_size, border_size, border_size, cv2.BORDER_CONSTANT, value=[255, 255, 255])
            canvas[y:y + frame_height, x:x + frame_width] = frame
            frames_combined +=1

        else:
            print(f"Error: File 'capture-btns-node-{node}.jpg' could not be found.")

        node += 1    

    print(f"{frames_combined}/{total_frames} frames combined")
    return canvas