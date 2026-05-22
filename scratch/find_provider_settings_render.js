import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const term = 'isProviderSetting';
let idx = 0;
while (true) {
  idx = content.indexOf(term, idx);
  if (idx === -1) break;
  console.log(`\nFound "${term}" at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 800));
  idx += term.length;
}
