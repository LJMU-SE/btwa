const { v4 } = require("uuid");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const sqlite3 = require("sqlite3").verbose();

// Function to create the "users" and "captures" tables in the database
function createCaptureTable(db) {
    db.serialize(() => {
        // Create the "users" table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`);

        db.run(`CREATE TABLE IF NOT EXISTS captures (
        capture_id TEXT PRIMARY KEY UNIQUE NOT NULL,
        capture_date TEXT NOT NULL,
        user_id TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    )`);
    });
}

async function getRowByEmail(db, email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function createUser(db, userID, name, email) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (user_id, email, first_name) VALUES (?, ?, ?)",
            [userID, email, name],
            (err) => {
                if (err) {
                    console.error("Error creating user:", err);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

async function saveCapture(captureId, userEmail, name) {
    // Function to insert a capture with user creation if needed
    const captureDate = new Date();

    // Function to insert a capture with the given user_id
    async function insertCaptureWithUserId(db, userID) {
        db.run(
            "INSERT INTO captures (capture_id, capture_date, user_id) VALUES (?, ?, ?)",
            [captureId, captureDate, userID],
            (err) => {
                if (err) {
                    console.error("Error inserting capture:", err);
                }
            }
        );
    }

    try {
        // Connect to the SQLite database (or create it if it doesn't exist)
        const db = new sqlite3.Database("./db/main.db");

        createCaptureTable(db);

        // Check if the user with the provided email already exists
        const row = await getRowByEmail(db, userEmail);

        if (row != undefined && Object.keys(row).includes("user_id")) {
            const userID = row.user_id;
            await insertCaptureWithUserId(db, userID);
        } else {
            // Generate new user ID
            const userID = await v4();
            await createUser(db, userID, name, userEmail);
            await insertCaptureWithUserId(db, userID);
        }

        // Close the database connection
        db.close();
    } catch (error) {
        console.error("Error in saveCapture:", error);
    }
}

async function generateVideo(images, id, x, y) {
    return new Promise(async (resolve, reject) => {
        // Loop through all of the responses
        let index = 1;
        for (let image of images) {
            // Write the buffer to the output directory
            await fs.writeFileSync(
                `./public/outputs/${id}/images/capture-${image.node}.jpg`,
                image.imgData,
                "base64"
            );

            // Increase the index
            index++;
        }

        // Convert images to MP4
        const config = {
            framerate: 6,
            resolution: `${x}x${y}`,
        };

        const args = [
            "ffmpeg",
            "-r",
            config.framerate,
            "-s",
            config.resolution,
            "-start_number",
            "101",
            "-i",
            `./public/outputs/${id}/images/capture-btns-node-%03d.jpg`,
            "-vcodec",
            "libx264",
            "-crf",
            "25",
            `./public/outputs/${id}/output.mp4`,
        ];

        const command = args.join(" ");

        try {
            const { stdout, stderr } = await exec(command);
            resolve("Video generated successfully");
        } catch (error) {
            console.log(error);
            reject("Unable to generate video");
        }
    });
}

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: `${req.method} method not allowed on this route`,
        });
    }

    // Generate a unique ID for the current capture
    const captureID = await v4();

    try {
        const { body } = req;
        const { images, x, y, email, name } = JSON.parse(body);

        // Make sure the output directory exists, if not, create it
        await fs.mkdirSync(`./public/outputs/${captureID}/images`, {
            recursive: true,
        });

        // Generate video creation command
        await generateVideo(images, captureID, x, y);
        await saveCapture(captureID, email, name);

        console.log("🟢 | Video Render Finished");
        return res.status(200).json({
            message: "Video Render Successful",
            id: captureID,
        });
    } catch (error) {
        console.error("🔴 | Error during video rendering:", error);
        if (captureID) {
            await fs.rmdirSync(`./public/outputs/${captureID}`, {
                recursive: true,
                force: true,
            });
        }
        return res.status(500).json({
            message: "Video Render Failed",
            error: error.message,
        });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb",
        },
    },
};

export default handler;
