import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainPath, 'utf8');

function show(idx, len = 600) {
  console.log(`\n--- Index ${idx} ---`);
  console.log(mainContent.substring(idx - 100, idx + len));
}

show(7233788, 500);
