import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

let idx = bakContent.indexOf('oRn=');
if (idx !== -1) {
  console.log(`Found oRn in main.js.bak at index ${idx}:`);
  // Let's print about 8000 characters from there to see the rendering part
  console.log(bakContent.substring(idx, idx + 8000));
}
