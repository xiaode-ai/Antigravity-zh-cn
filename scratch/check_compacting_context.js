import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainContent = fs.readFileSync(path.join(outDir, 'jetskiAgent', 'main.js.bak'), 'utf8');

const idx = mainContent.indexOf('Compacting');
if (idx !== -1) {
  console.log(mainContent.substring(idx - 400, idx + 400));
} else {
  console.log('Not found');
}
