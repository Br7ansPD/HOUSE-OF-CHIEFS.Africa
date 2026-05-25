/**
 * =========================================================================
 * NEXUS CORE ENGINE (ZERO-TRUST) - FORTRESS EDITION
 * FILE: forge-manifest.js
 * TARGET REPO: PLANETCAN-house-of-chiefs-GEN11.V6
 * VERSION: GEN 11.2 V50.011.001
 * =========================================================================
 */

const fs = require('fs');
const path = require('path');
const DIRECTORY_TO_SCAN = './';
const MANIFEST_FILE = 'fleet-manifest.json';
const IGNORE_DIRS = ['node_modules', '.git'];

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

function extractMetadata(filePath, ext) {
    let metadata = { cloudTruth: "UNTRACKED", survivalWeight: "FOUNDATION", apexSolutionTitle: "NEXUS COMPONENT", campusVisibility: false };
    if (ext === '.mp4' || ext === '.pdf') { metadata.survivalWeight = "BRIEFCASE"; }
    try {
        if (['.html', '.js', '.json', '.toml'].includes(ext)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const versionMatch = content.match(/(V[0-9]{2,3}\.[0-9]{3}\.[0-9]{3})/);
            if (versionMatch) metadata.cloudTruth = versionMatch[1];
            const weightMatch = content.match(/<meta name="survival-weight" content="([^"]+)">/);
            if (weightMatch) metadata.survivalWeight = weightMatch[1];
            const titleMatch = content.match(/<meta name="apex-solution-title" content="([^"]+)">/);
            if (titleMatch) metadata.apexSolutionTitle = titleMatch[1];
            const visMatch = content.match(/<meta name="campus-visibility" content="([^"]+)">/);
            if (visMatch && visMatch[1] === 'true') metadata.campusVisibility = true;
        }
    } catch (err) {}
    return metadata;
}

function buildManifest() {
    console.log("[FORGE] Initiating Cloud Truth Omni-Scan (V50.011.001)...");
    const allFiles = scanFiles(DIRECTORY_TO_SCAN);
    const manifest = [];
    const allowedExtensions = ['.html', '.js', '.toml', '.json', '.jpg', '.png', '.mp4', '.pdf', '.css', '.ico', '.webp', '.jpeg'];
    
    for (const file of allFiles) {
        const ext = path.extname(file).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            
            // [!] THE FIX: Explicitly ignore manifest, package files, and comms from version tracking
            if (file.endsWith(MANIFEST_FILE) || 
                file.endsWith('package-lock.json') || 
                file.endsWith('package.json') || 
                file.endsWith('halo-comms.json')) {
                continue;
            }

            const metadata = extractMetadata(file, ext);
            const normalizedPath = file.replace(/\\/g, '/');
            let finalPath = normalizedPath.startsWith('./') ? normalizedPath.slice(2) : normalizedPath;
            
            manifest.push({
                fileNode: '/' + finalPath, 
                cloudTruth: metadata.cloudTruth, 
                survivalWeight: metadata.survivalWeight,
                apexSolutionTitle: metadata.apexSolutionTitle, 
                campusVisibility: metadata.campusVisibility, 
                lastForged: new Date().toISOString()
            });
        }
    }
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`[FORGE] Manifest forged successfully. Tracked ${manifest.length} nodes.`);
}
buildManifest();