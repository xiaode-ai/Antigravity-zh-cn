import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainPath, 'utf8');

let pos = -1;
let index = 0;
while ((pos = mainContent.indexOf('p(qne', pos + 1)) !== -1) {
  index++;
  console.log(`\n=== Match #${index} at position ${pos} ===`);
  console.log(mainContent.substring(pos - 100, pos + 400));
}
