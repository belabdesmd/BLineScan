import path from "path";
import { walkFiles } from "./utils/fileWalker.js";
import { analyzeHtml } from "./analyzers/htmlAnalyzer.js";
import {analyzeCss} from "./analyzers/cssAnalyzer.js";

export function scan(target, options) {
    const dir = target ? path.resolve(target) : process.cwd();
    console.log(`🔍 Scanning: ${dir}`);

    const files = walkFiles(dir);
    const results = [];

    for (const file of files) {
        /* TODO: return if (file.endsWith(".html")) {
            console.log(analyzeHtml(file).summary);
            //results.push(...analyzeHtml(file));
        }*/

        if (file.endsWith(".css") || file.endsWith(".scss") || file.endsWith(".sass") || file.endsWith(".less")) {
            console.log(analyzeCss(file).summary);
            //results.push(...analyzeCSS(file));
        }
        // Later: add analyzeJs
    }

    if (options.json) {
        console.log(JSON.stringify(results, null, 2));
    } else {
        console.log("Scan complete. Features found:");
        console.log(results);
    }

}