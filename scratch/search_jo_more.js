import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

// Find where settingKey is used
let idx = 0;
while (true) {
  idx = bakContent.indexOf('settingKey:', idx);
  if (idx === -1) break;
  console.log(`\nFound settingKey: at index ${idx}:`);
  console.log(bakContent.substring(idx - 100, idx + 300));
  idx += 12;
}
