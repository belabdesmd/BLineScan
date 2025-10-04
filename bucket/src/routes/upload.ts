import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const router = Router();
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, `${uuidv4()}.json`)
});

const upload = multer({ storage });

// POST /api/upload
// Accepts a JSON report and an optional ?hours=number query param
router.post("/", upload.single("file"), (req, res) => {
    const hours = Number(req.query.hours) || 24;
    const fileId = path.basename(req.file!.filename, ".json");

    // Store metadata file with expiry timestamp
    const expiresAt = Date.now() + hours * 60 * 60 * 1000;
    const metaPath = path.join(uploadDir, `${fileId}.meta.json`);
    fs.writeFileSync(metaPath, JSON.stringify({ expiresAt }));

    res.json({ id: fileId, expiresInHours: hours });
});

export default router;
