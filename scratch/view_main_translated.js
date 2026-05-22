import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const mainContent = fs.readFileSync(mainPath, 'utf8');

const term = '产物审核策略';
let idx = 0;
while (true) {
  idx = mainContent.indexOf(term, idx);
  if (idx === -1) break;
  console.log(`\nFound "${term}" in main.js at index ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 650));
  idx += term.length;
}
