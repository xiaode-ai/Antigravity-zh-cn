import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') }
];

let output = [];
function log(msg) {
  console.log(msg);
  output.push(msg);
}

log('=== Scanning NLS Messages ===');
if (fs.existsSync(nlsPath)) {
  try {
    const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
    nlsData.forEach((val, idx) => {
      if (typeof val === 'string') {
        // Look for exact "Settings"
        if (val === 'Settings') {
          log(`[NLS Settings Exact] Index ${idx}: "${val}"`);
        }
        // Look for "Limited time" (any case)
        if (val.toLowerCase().includes('limited time')) {
          log(`[NLS Limited Time] Index ${idx}: "${val}"`);
        }
      }
    });
  } catch (err) {
    log(`Error reading NLS: ${err.message}`);
  }
} else {
  log('nls.messages.json.bak not found');
}

log('\n=== Scanning JS files for "Limited time" ===');
files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    log(`[File Not Found] ${f.name}`);
    return;
  }
  const content = fs.readFileSync(f.path, 'utf8');
  
  // Search for "limited time"
  const regex = /limited\s*time/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const idx = match.index;
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + match[0].length + 150);
    log(`[JS Limited Time in ${f.name}] Match: "${match[0]}" at index ${idx}`);
    log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  }
});

log('\n=== Scanning JS files for exact "Settings" in configurations ===');
files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    log(`[File Not Found] ${f.name}`);
    return;
  }
  const content = fs.readFileSync(f.path, 'utf8');
  
  // Look for "Settings" as title or settings window specific text
  const settingsRegex = /"Settings"|'Settings'/g;
  let match;
  let count = 0;
  while ((match = settingsRegex.exec(content)) !== null) {
    count++;
    if (count > 40) {
      log(`[JS Settings] Too many matches for "Settings" literal in ${f.name}, stopping.`);
      break;
    }
    const idx = match.index;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + match[0].length + 100);
    log(`[JS Settings in ${f.name}] Match: "${match[0]}" at index ${idx}`);
    log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  }
});

fs.writeFileSync(path.join(process.cwd(), 'scratch', 'missing_terms_results.txt'), output.join('\n'), 'utf8');
log(`\n[OK] Wrote results to scratch/missing_terms_results.txt`);
