/* [forge-manifest.js] | Version: V026.003.005 | HALO-AURA CLOUD TRUTH GENERATOR */

const fs = require('fs');
const path = require('path');

const DIRECTORY_TO_SCAN = './';
const MANIFEST_FILE = 'fleet-manifest.json';

// Directories to ignore during the deep scan to save build time
const IGNORE_DIRS = ['node_modules', '.git', 'assets'];

function scanFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory() && !IGNORE_DIRS.includes(file)) {
            scanFiles(path.join(dir, file), fileList);
        } else if (stat.isFile()) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

function extractVersion(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // GLOBAL RADAR SWEEP: Hunt for the strict semantic version string anywhere in the file
        const versionMatch = content.match(/(V[0-9]{2,3}\.[0-9]{3}\.[0-9]{3})/);
        if (versionMatch) return versionMatch[1];
        
        return "UNTRACKED";
    } catch (err) {
        return "ERROR";
    }
}

function buildManifest() {
    console.log("[FORGE] Initiating Cloud Truth Omni-Scan (V026.003.005)...");
    const allFiles = scanFiles(DIRECTORY_TO_SCAN);
    const manifest = [];

    for (const file of allFiles) {
        // Track core infrastructure
        if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.toml') || file.endsWith('.json')) {
            
            // Safety Override: Do not scan the output manifest itself
            if (file.endsWith(MANIFEST_FILE)) continue;

            const version = extractVersion(file);
            
            if (version !== "UNTRACKED" && version !== "ERROR") {
                // Normalize file path format for the dashboard radar
                const normalizedPath = file.replace(/\\/g, '/');
                // Strip the leading './' if present
                let finalPath = normalizedPath.startsWith('./') ? normalizedPath.slice(2) : normalizedPath;
                
                manifest.push({
                    fileNode: '/' + finalPath, // Prepend slash to match UI logic
                    cloudTruth: version,
                    lastForged: new Date().toISOString()
                });
            }
        }
    }

    // Write the final JSON manifest for the Netlify server to host
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`[FORGE] Manifest forged successfully. Tracked ${manifest.length} nodes.`);
}

buildManifest();
