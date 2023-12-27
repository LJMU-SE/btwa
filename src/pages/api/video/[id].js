import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const { id } = req.query;
    const filePath = path.resolve(`./outputs/${id}/output.mp4`);
    const fileBuffer = fs.readFileSync(filePath);
    res.setHeader("Content-Type", "video/mp4");
    return res.send(fileBuffer);
}
