import fs from 'fs';
import path from 'path';

const files = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\n================== Searching in: ${path.basename(filePath)} ==================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Search for the component name "dBi"
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf('dBi', idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + 150);
    console.log(`\n  [MATCH #${count}] at index ${idx}`);
    console.log(`  Context: ${content.substring(start, end).trim().replace(/\s+/g, ' ')}`);
    idx += 3;
    if (count >= 10) {
      break;
    }
  }
});
