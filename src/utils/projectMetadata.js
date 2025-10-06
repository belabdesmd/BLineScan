import path from "path";
import fs from "fs";

export function findProjectName(startDir = process.cwd()) {
    let dir = startDir;
    let pkgPath = null;
    while (true) {
        const pkg = path.join(dir, 'package.json');
        if (fs.existsSync(pkg)) {
            pkgPath = pkg;
            break;
        }

        const parent = dirname(dir);
        if (parent === dir) break; // reached root
        dir = parent;
    }

    if (!pkgPath) {
        console.error('❌ No package.json found in this directory or any parent directory.');
        process.exit(1);
    }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    return pkg.name;
}

export function getCurrentDateString() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}