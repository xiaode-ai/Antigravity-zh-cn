import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

// Find where JO is defined
let idx = bakContent.indexOf('JO=');
if (idx === -1) {
  idx = bakContent.indexOf('JO ');
}
if (idx !== -1) {
  console.log(`Found JO in main.js.bak at index ${idx}:`);
  console.log(bakContent.substring(idx - 100, idx + 1500));
} else {
  console.log('JO definition not found. Searching for usages...');
}
