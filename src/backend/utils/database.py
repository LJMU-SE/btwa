import sqlite3
import datetime
import uuid

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

def get_row_by_email(db, email):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    return row

def create_user(db, user_id, name, email):
    db.execute("INSERT INTO users (user_id, email, first_name) VALUES (?, ?, ?)", (user_id, email, name))

def insert_capture_with_user_id(db, capture_id, capture_date, type, size, user_id):
    db.execute("INSERT INTO captures (capture_id, capture_date, type, size, user_id) VALUES (?, ?, ?, ?, ?)", (capture_id, capture_date, type, size, user_id))
    
def save_capture(capture_id, user_email, size, type, name):
    capture_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_path = "./db/main.db"

    try:
        db = sqlite3.connect(db_path)
        create_capture_table(db)

        row = get_row_by_email(db, user_email)

        if row and 'user_id' in row:
            user_id = row['user_id']
            insert_capture_with_user_id(db, capture_id, capture_date, type, size, user_id)
        else:
            user_id = str(uuid.uuid4())
            create_user(db, user_id, name, user_email)
            insert_capture_with_user_id(db, capture_id, capture_date, type, size, user_id)

        db.commit()
    except Exception as e:
        print(f"Error in save_capture: {e}")
    finally:
        db.close()