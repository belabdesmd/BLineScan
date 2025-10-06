import fs from "fs";
import path from "path";
import http from "http";
import serveStatic from "serve-static";
import finalhandler from "finalhandler";
import FormData from 'form-data';
import {walkFiles} from "./utils/fileWalker.js";
import {analyzeHtml} from "./analyzers/htmlAnalyzer.js";
import {analyzeCss} from "./analyzers/cssAnalyzer.js";
import {getOverallSummary} from "./utils/baselineSummarizer.js";
import axios from "axios";

export async function scan(options) {
    const {remote, src} = options;
    const dir = src ? path.resolve(src) : process.cwd();

    console.log(`🔍 Scanning: ${dir}`);

    const files = walkFiles(dir);
    let result = {};

    for (const file of files) {
        if (file.endsWith(".html")) result = {...result, html: analyzeHtml(file)};
        if (file.endsWith(".css") || file.endsWith(".scss") || file.endsWith(".sass") || file.endsWith(".less")) {
            result = {...result, css: analyzeCss(file)};
        }
    }

    // Save Report Locally
    const filePath = saveReport({...getOverallSummary(result.html, result.css), ...result});
    if (remote !== undefined) {
        const hours = remote === true || remote === "" ? 24 : Number(remote);
        if (isNaN(hours) || hours <= 0) {
            console.error("❌ Invalid value for --remote. It must be a positive number of hours.");
            process.exit(1);
        }

        console.log(`🌐 Remote upload enabled. Expiration in ${hours} hour(s).`);

        // Upload report!
        await uploadReport(filePath, "https://blinescan-bucket.belfodil.me", "https://blinescan.belfodil.me", hours);
    } else {
        // Start Dashboard Locally
        const root = path.join(process.cwd(), ".baseline-reports");
        const serve = serveStatic(root);
        const server = http.createServer((req, res) => serve(req, res, finalhandler(req, res)));
        server.listen(0, () => {
            const port = server.address().port;
            const url = `http://localhost:${port}?file=reports/${encodeURIComponent(path.basename(filePath))}`;
            console.log("Open:", url);
        });
    }
}

export function saveReport(report, projectRoot = process.cwd()) {
    const reportsDir = path.join(projectRoot, ".baseline-reports/reports");

    // Make sure the directory exists
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, {recursive: true});
    }

    // File name (timestamped or constant)
    const fileName = `report-${new Date().toISOString().replace(/[:T]/g, "-").split(".")[0]}.json`;
    const filePath = path.join(reportsDir, fileName);

    // Write JSON with pretty format
    fs.cpSync("dashboard/dist/blinescan-dash/browser", ".baseline-reports", {recursive: true});
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

    console.log(`✅ Baseline report saved at: ${filePath}`);

    return filePath;
}

export async function uploadReport(filePath, serverUrl, dashUrl, hours = 24) {
    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append("file", fileStream, path.basename(filePath));

    try {
        const response = await axios.post(`${serverUrl}/api/upload?hours=${hours}`, formData, {
            headers: {...formData.getHeaders()},
        });

        const data = await response.data;
        console.log(`✅ Uploaded successfully!`);
        console.log(`🆔 Report ID: ${data.id}`);
        console.log(`⏱ Expires in: ${data.expiresInHours}h`);
        console.log(`🌍 Remote URL: ${dashUrl}?file=${data.id}`);
        return data;
    } catch (err) {
        console.error("❌ Failed to upload report:", err.message);
        throw err;
    }
}
