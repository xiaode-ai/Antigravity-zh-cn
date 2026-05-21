import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const translationsPath = './translations.json';

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

// Sort by length like the main translator does
const sortedTranslations = [...translations].sort((a, b) => b.old.length - a.old.length);

console.log(`Loaded ${sortedTranslations.length} translation mappings.`);

// Use a temporary JS file for syntax check because Node.js requires .js extension
const tempFile = './temp_debug_main.js';

// Start with the original backup content
let currentContent = fs.readFileSync(backupPath, 'utf8');
fs.writeFileSync(tempFile, currentContent, 'utf8');

let appliedCount = 0;
let failedMappings = [];

for (let i = 0; i < sortedTranslations.length; i++) {
  const pair = sortedTranslations[i];
  if (!currentContent.includes(pair.old)) {
    // Mapping not applied (either not found or already replaced as part of a larger mapping)
    continue;
  }

  // Apply this mapping
  const nextContent = currentContent.replaceAll(pair.old, pair.new);
  
  // Write to temp file and check syntax
  fs.writeFileSync(tempFile, nextContent, 'utf8');
  try {
    execSync(`node --check "${tempFile}"`, { stdio: 'pipe' });
    // If it passed, keep this modification
    currentContent = nextContent;
    appliedCount++;
  } catch (err) {
    console.error(`\n[CRITICAL ERROR] Mapping at sorted index ${i} (original index in translations.json unknown) broke the syntax!`);
    console.error(`Old: ${pair.old}`);
    console.error(`New: ${pair.new}`);
    if (err.stderr) {
      console.error('Stderr:', err.stderr.toString());
    } else {
      console.error('Error message:', err.message);
    }
    failedMappings.push({ index: i, pair });
    // Do not update currentContent so we skip this broken mapping and test others
  }
}

// Clean up
if (fs.existsSync(tempFile)) {
  fs.unlinkSync(tempFile);
}

console.log(`\nDebug run completed. Applied ${appliedCount} passing mappings. ${failedMappings.length} mappings failed.`);
