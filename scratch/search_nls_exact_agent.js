import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(outDir, '..', 'nls.messages.json.bak');
const normalNlsPath = path.join(outDir, '..', 'nls.messages.json');

const clpDir = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp';

const searchTerms = [
  "View all",
  "Reset to default",
  "shortcuts",
  "Background Processes",
  "Background Process",
  "Processes Running",
  "Terminal",
  "Last Updated",
  "pages",
  "Launch",
  "Browser",
  "Global",
  "Workspace",
  "Manage",
  "Snooze",
  "Start",
  "Agent",
  "Back to Agent"
];

// 读取主 NLS 文件
let nlsData = [];
const activeNlsPath = fs.existsSync(nlsPath) ? nlsPath : normalNlsPath;
if (fs.existsSync(activeNlsPath)) {
  try {
    nlsData = JSON.parse(fs.readFileSync(activeNlsPath, 'utf8'));
    console.log(`Loaded NLS file from ${activeNlsPath} with ${nlsData.length} items.`);
  } catch (e) {
    console.error(`Error loading NLS: ${e.message}`);
  }
} else {
  console.log(`NLS file not found at ${activeNlsPath}`);
}

const nlsResults = [];
searchTerms.forEach(term => {
  const matches = [];
  nlsData.forEach((val, idx) => {
    if (typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase())) {
      matches.push({ idx, val });
    }
  });
  if (matches.length > 0) {
    nlsResults.push(`\n--- Term: "${term}" (Total Found in main NLS: ${matches.length}) ---`);
    matches.forEach(m => {
      nlsResults.push(`  Index ${m.idx}: "${m.val}"`);
    });
  }
});

console.log(nlsResults.join('\n'));

// 扫描 CLP NLS 文件
console.log('\n--- Scanning CLP files ---');
if (fs.existsSync(clpDir)) {
  const clpNlsFiles = [];
  function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        walk(fullPath);
      } else if (file.toLowerCase() === 'nls.messages.json' && !fullPath.endsWith('.bak')) {
        clpNlsFiles.push(fullPath);
      }
    });
  }
  walk(clpDir);
  
  clpNlsFiles.forEach(fp => {
    try {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      const clpMatches = [];
      searchTerms.forEach(term => {
        data.forEach((val, idx) => {
          if (typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase())) {
            clpMatches.push({ term, idx, val });
          }
        });
      });
      if (clpMatches.length > 0) {
        console.log(`CLP File: ${fp}`);
        clpMatches.slice(0, 20).forEach(m => {
          console.log(`  Index ${m.idx} (Search "${m.term}"): "${m.val}"`);
        });
        if (clpMatches.length > 20) {
          console.log(`  ... and ${clpMatches.length - 20} more`);
        }
      }
    } catch (e) {
      console.error(`Error reading ${fp}: ${e.message}`);
    }
  });
} else {
  console.log('CLP directory does not exist.');
}
