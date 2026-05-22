import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

// Search for qne definition
let idx = bakContent.indexOf('qne=');
if (idx === -1) {
  idx = bakContent.indexOf('qne ');
}
if (idx !== -1) {
  console.log(`Found qne in main.js.bak at index ${idx}:`);
  console.log(bakContent.substring(idx - 100, idx + 1500));
} else {
  console.log('qne definition not found');
}
