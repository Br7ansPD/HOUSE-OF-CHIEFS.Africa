/**
 * =========================================================================
 * NEXUS CORE ENGINE (ZERO-TRUST) - FORTRESS EDITION
 * FILE: forge-manifest.js
 * TARGET REPO: PLANETCAN-house-of-chiefs-GEN11.V6
 * SYSTEM CATEGORY: AUTH-FORTRESS
 * VERSION: GEN 11.2 V50.012.007
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

function extractMetadata(filePath, ext, fileName) {
    let metadata = { 
        cloudTruth: "UNTRACKED", 
        survivalWeight: "FOUNDATION", 
        apexSolutionTitle: "NEXUS COMPONENT", 
        campusVisibility: false,
        systemCategory: "00-CORE-VAULT" 
    };

    if (['.mp4', '.pdf', '.jpg', '.png', '.ico', '.webp', '.jpeg'].includes(ext)) { 
        metadata.survivalWeight = "BRIEFCASE"; 
        metadata.systemCategory = "STATIC-ASSET";
    }

    if (fileName.includes('service-worker.js') || fileName === 'package.json' || fileName === 'netlify.toml' || fileName === 'forge-manifest.js') {
        metadata.systemCategory = "AUTH-FORTRESS";
    }

    try {
        if (['.html', '.js', '.json', '.toml', '.css'].includes(ext)) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            const versionMatch = content.match(/(V[0-9]{2,3}\.[0-9]{3}\.[0-9]{3})/);
            if (versionMatch) metadata.cloudTruth = versionMatch[1];
            
            const weightMatch = content.match(/<meta name="survival-weight" content="([^"]+)">/);
            if (weightMatch) metadata.survivalWeight = weightMatch[1];
            
            const titleMatch = content.match(/<meta name="apex-solution-title" content="([^"]+)">/);
            if (titleMatch) metadata.apexSolutionTitle = titleMatch[1];
            
            const visMatch = content.match(/<meta name="campus-visibility" content="([^"]+)">/);
            if (visMatch && visMatch[1] === 'true') metadata.campusVisibility = true;

            const catMatchHtml = content.match(/<meta name="system-category" content="([^"]+)">/);
            const catMatchHeader = content.match(/SYSTEM CATEGORY:\s*([^\n\r]+)/);
            const catMatchJson = content.match(/"_SYSTEM_CATEGORY":\s*"([^"]+)"/);
            
            if (catMatchHtml) metadata.systemCategory = catMatchHtml[1].trim();
            else if (catMatchHeader) metadata.systemCategory = catMatchHeader[1].trim();
            else if (catMatchJson) metadata.systemCategory = catMatchJson[1].trim();
        }
    } catch (err) {}
    
    return metadata;
}

function buildManifest() {
    console.log("[FORGE] Initiating Cloud Truth Omni-Scan (V50.012.007)...");
    const allFiles = scanFiles(DIRECTORY_TO_SCAN);
    const manifest = [];
    const allowedExtensions = ['.html', '.js', '.toml', '.json', '.jpg', '.png', '.mp4', '.pdf', '.css', '.ico', '.webp', '.jpeg'];
    
    for (const file of allFiles) {
        const ext = path.extname(file).toLowerCase();
        const fileName = path.basename(file);

        if (allowedExtensions.includes(ext)) {
            
            if (file.endsWith(MANIFEST_FILE) || 
                file.endsWith('package-lock.json') || 
                file.endsWith('package.json') || 
                file.endsWith('halo-comms.json')) {
                continue;
            }

            const metadata = extractMetadata(file, ext, fileName);
            const normalizedPath = file.replace(/\\/g, '/');
            let finalPath = normalizedPath.startsWith('./') ? normalizedPath.slice(2) : normalizedPath;
            
            manifest.push({
                fileNode: '/' + finalPath, 
                cloudTruth: metadata.cloudTruth, 
                survivalWeight: metadata.survivalWeight,
                apexSolutionTitle: metadata.apexSolutionTitle, 
                campusVisibility: metadata.campusVisibility, 
                systemCategory: metadata.systemCategory,
                lastForged: new Date().toISOString()
            });
        }
    }
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`[FORGE] Manifest forged successfully. Tracked ${manifest.length} nodes.`);
}
buildManifest();