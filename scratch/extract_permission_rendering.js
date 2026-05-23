import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainContent = fs.readFileSync(path.join(outDir, 'jetskiAgent', 'main.js.bak'), 'utf8');

const idx = mainContent.indexOf('Yes, allow this time');
if (idx !== -1) {
  console.log('--- AROUND "Yes, allow this time" in main.js.bak ---');
  console.log(mainContent.substring(idx - 600, idx + 600));
}

const idxFzi = mainContent.indexOf('fZi={read_file');
if (idxFzi !== -1) {
  console.log('\n--- AROUND "fZi" in main.js.bak ---');
  console.log(mainContent.substring(idxFzi - 200, idxFzi + 500));
}
