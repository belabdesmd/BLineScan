import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

export function scheduleCleanup() {
    setInterval(() => {
        const files = fs.readdirSync(uploadDir).filter(f => f.endsWith(".meta.json"));

        for (const metaFile of files) {
            const metaPath = path.join(uploadDir, metaFile);
            const { expiresAt } = JSON.parse(fs.readFileSync(metaPath, "utf8"));
            if (Date.now() > expiresAt) {
                const id = path.basename(metaFile, ".meta.json");
                const jsonFile = path.join(uploadDir, `${id}.json`);
                if (fs.existsSync(jsonFile)) fs.unlinkSync(jsonFile);
                fs.unlinkSync(metaPath);
            }
        }
        console.log("🧹 Cleanup done");
    }, 60 * 60 * 1000); // every hour
}
