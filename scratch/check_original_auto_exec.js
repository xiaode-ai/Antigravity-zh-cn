import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const bakContent = fs.readFileSync(bakPath, 'utf8');

const term = 'CASCADE_AUTO_EXECUTION_POLICY';
let idx = bakContent.indexOf(term);
if (idx !== -1) {
  console.log(`Found "${term}" in main.js.bak:`);
  console.log(bakContent.substring(idx - 100, idx + 800));
}
