import fs from "fs";
import path from "path";
import {walkFiles} from "./utils/fileWalker.js";
import {analyzeHtml} from "./analyzers/htmlAnalyzer.js";
import {analyzeCss} from "./analyzers/cssAnalyzer.js";
import {getOverallSummary} from "./utils/baselineSummarizer.js";

export function scan(target, options) {
    const dir = target ? path.resolve(target) : process.cwd();
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
    saveReport({overall: getOverallSummary(result.html, result.css), ...result})

    // TODO: Finish this part later
    if (options.json) {
    }
}

export function saveReport(report, projectRoot = process.cwd()) {
    const reportsDir = path.join(projectRoot, ".baseline-reports");

    // Make sure the directory exists
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, {recursive: true});
    }

    // File name (timestamped or constant)
    const fileName = `report-${new Date().toISOString().replace(/[:T]/g, "-").split(".")[0]}.json`;
    const filePath = path.join(reportsDir, fileName);

    // Write JSON with pretty format
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

    console.log(`✅ Baseline report saved at: ${filePath}`);
    return filePath;
}
