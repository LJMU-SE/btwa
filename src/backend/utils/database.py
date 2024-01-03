import os
import sqlite3
from datetime import datetime
import uuid

# Function to create the 'users' and 'captures' tables if they don't exist
def create_capture_table(db):
    db.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY UNIQUE NOT NULL,
            first_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    ''')

    db.execute('''
        CREATE TABLE IF NOT EXISTS captures (
            capture_id TEXT PRIMARY KEY UNIQUE NOT NULL,
            capture_date TEXT NOT NULL,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            size TEXT NOT NULL,
            shared_twitter BOOLEAN NOT NULL DEFAULT false,
            shared_instagram BOOLEAN NOT NULL DEFAULT false,
            shared_YouTube BOOLEAN NOT NULL DEFAULT false,
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        )
    ''')

# Function to retrieve a row from 'users' table based on email
def get_row_by_email(db, email):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    return row

# Function to insert a new user into the 'users' table
def create_user(db, user_id, name, email):
    db.execute("INSERT INTO users (user_id, email, first_name) VALUES (?, ?, ?)", (user_id, email, name))

# Function to insert a new capture with associated user_id into the 'captures' table
def insert_capture_with_user_id(db, capture_id, capture_date, type, size, user_id):
    db.execute("INSERT INTO captures (capture_id, capture_date, type, size, user_id) VALUES (?, ?, ?, ?, ?)", (capture_id, capture_date, type, size, user_id))

# Function to save a capture record in the database
def save_capture(capture_id, user_email, size, type, name):
    capture_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_path = "../../db/main.db"
    
    os.makedirs("../../db", exist_ok=True)

    try:
        # Connect to the database and create tables if not exist
        db = sqlite3.connect(db_path)
        create_capture_table(db)

        # Check if the user with the given email already exists
        row = get_row_by_email(db, user_email)

        if row:
            user_id = row[0]
            insert_capture_with_user_id(db, capture_id, capture_date, type, size, user_id)
        else:
            # If user doesn't exist, create a new user and insert the capture record
            user_id = str(uuid.uuid4())
            create_user(db, user_id, name, user_email)
            insert_capture_with_user_id(db, capture_id, capture_date, type, size, user_id)

        # Commit the changes to the database
        db.commit()
    except Exception as e:
        print(f"Error in save_capture: {e}")
    finally:
        # Close the database connection
        db.close()

# Function to get all captures for a given email
def get_captures_by_email(email):
    db_path = "../../db/main.db"
    
    os.makedirs("../../db", exist_ok=True)

    try:
        # Connect to the database and create tables if not exist
        db = sqlite3.connect(db_path)
        create_capture_table(db)

        # Get the user_id for the given email
        cursor = db.cursor()
        cursor.execute("SELECT user_id, first_name FROM users WHERE email LIKE ?", ('%' + email + '%',))
        row = cursor.fetchone()

        # If no user exists with the given email, return None
        if row is None:
            return None

        # Get all captures for the given user_id
        user_id = row[0]
        name = row[1]
        cursor.execute("SELECT * FROM captures WHERE user_id = ?", (user_id,))
        rows = cursor.fetchall()

        # Create a list to store the captures
        captures = []

        # Iterate over the rows and create capture objects
        for row in rows:
            capture = {
                'capture_id': row[0],
                'capture_date': row[1],
                'user_id': row[2],
                'type': row[3],
                'size': row[4],
                'shared_twitter': row[5],
                'shared_instagram': row[6],
                'shared_YouTube': row[7]
            }

            # Create a user object without the email
            user = {
                'user_id': user_id,
                'name': name
            }

            captures.append({
                "capture": capture,
                "user": user
            })

        # Return the captures and user objects
        return captures
    except Exception as e:
        print(f"Error in get_captures_by_email: {e}")
        return None
    finally:
        db.close()