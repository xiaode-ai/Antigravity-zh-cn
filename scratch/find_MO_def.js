import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const term = 'MO=';
let idx = content.indexOf(term);
if (idx === -1) {
  idx = content.indexOf('function MO');
}
if (idx !== -1) {
  console.log(`Found MO at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 1000));
} else {
  console.log('MO definition not found');
}
