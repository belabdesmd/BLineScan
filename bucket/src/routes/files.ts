import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();
const uploadDir = path.join(process.cwd(), "uploads");

// GET /api/files/:id
// Serves the report JSON file if it exists and not expired
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const filePath = path.join(uploadDir, `${id}.json`);
    const metaPath = path.join(uploadDir, `${id}.meta.json`);

    if (!fs.existsSync(filePath) || !fs.existsSync(metaPath)) {
        return res.status(404).json({ error: "File not found or expired." });
    }

    const { expiresAt } = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    if (Date.now() > expiresAt) {
        // auto-delete expired files
        fs.unlinkSync(filePath);
        fs.unlinkSync(metaPath);
        return res.status(410).json({ error: "File expired." });
    }

    res.sendFile(filePath);
});

export default router;
