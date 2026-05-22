import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

// Find where One is defined in jetskiAgent/main.js.bak
const term = 'One=';
let idx = bakContent.indexOf(term);
if (idx === -1) {
  idx = bakContent.indexOf('One ');
}
if (idx !== -1) {
  console.log(`Found One at index ${idx}:`);
  console.log(bakContent.substring(idx - 100, idx + 1000));
} else {
  console.log('One definition not found');
}
