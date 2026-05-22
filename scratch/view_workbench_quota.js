import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const content = fs.readFileSync(wbPath, 'utf8');

const regex = /renderLimitedQuotaItem/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const idx = match.index;
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + 350);
  console.log(`Index ${idx}:`);
  console.log(`  Context: ${content.substring(start, end).replace(/\r?\n/g, ' ')}`);
}
