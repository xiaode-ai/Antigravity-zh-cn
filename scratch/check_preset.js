import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const mainContent = fs.readFileSync(mainPath, 'utf8');

const term = 'Security Preset';
let idx = mainContent.indexOf(term);
if (idx === -1) {
  idx = mainContent.indexOf('安全预设');
}
if (idx !== -1) {
  console.log(`Found preset at index ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 650));
} else {
  console.log('Preset not found');
}
