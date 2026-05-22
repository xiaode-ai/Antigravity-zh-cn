import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const term = 'options:[rl.EAGER,rl.PROCEED_IN_SANDBOX,rl.OFF]';
const idx = content.indexOf(term);
if (idx !== -1) {
  console.log('Found setting context:');
  console.log(content.substring(idx - 1200, idx + 200));
} else {
  console.log('Term not found');
}
