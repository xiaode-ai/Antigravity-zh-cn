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

  // Search for " - Settings" or "Settings - " or variations
  const patterns = [' - Settings', 'Settings -', ' - settings', 'settings -'];
  patterns.forEach(pat => {
    let idx = 0;
    while (true) {
      idx = content.indexOf(pat, idx);
      if (idx === -1) break;
      console.log(`Found pattern "${pat}" at index ${idx}:`);
      console.log(`  Context: ... ${content.substring(idx - 60, idx + 60).replace(/\r?\n/g, ' ')} ...`);
      idx += pat.length;
    }
  });
});
