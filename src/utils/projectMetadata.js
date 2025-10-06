export function findProjectName(startDir = process.cwd()) {
    let dir = startDir;
    let pkgPath = null;
    while (true) {
        const pkg = join(dir, 'package.json');
        if (existsSync(pkg)) {
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
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    return pkg.name;
}

export function getCurrentDateString() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}