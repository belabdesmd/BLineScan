import fs from "fs";
import path from "path";

export function walkFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of list) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(walkFiles(filePath));
        } else {
            results.push(filePath);
        }
    }

    return results;
}