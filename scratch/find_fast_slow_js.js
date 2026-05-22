import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  path.join(targetDir, 'jetskiAgent', 'main.js.bak'),
  path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak')
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\n=== Scanning ${path.basename(filePath)} ===`);
  const content = fs.readFileSync(filePath, 'utf8');

  // Search for Fast in contexts related to suggestions, Speed, tab, etc.
  let idx = 0;
  while (true) {
    idx = content.indexOf('"Fast"', idx);
    if (idx === -1) break;
    console.log(`Found "Fast" at index ${idx}:`);
    console.log(`  Context: ... ${content.substring(idx - 100, idx + 100).replace(/\r?\n/g, ' ')} ...`);
    idx += 6;
  }
  
  idx = 0;
  while (true) {
    idx = content.indexOf("'Fast'", idx);
    if (idx === -1) break;
    console.log(`Found 'Fast' at index ${idx}:`);
    console.log(`  Context: ... ${content.substring(idx - 100, idx + 100).replace(/\r?\n/g, ' ')} ...`);
    idx += 6;
  }
});
