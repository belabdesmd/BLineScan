import express from "express";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";
import uploadRouter from "./routes/upload.js";
import filesRouter from "./routes/files.js";
import {scheduleCleanup} from "./utils/cleanup.js";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "https://blinescan.belfodil.me/",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/upload", rateLimit({
    windowMs: 15 * 60 * 1000, limit: 50,
    message: "Too many uploads from this IP, please try again later."
}));
app.use("/api/upload", uploadRouter);
app.use("/api/files", filesRouter);

// Schedule cleanup every hour
scheduleCleanup();

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
