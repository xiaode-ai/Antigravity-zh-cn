import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

if (fs.existsSync(mainPath)) {
  const content = fs.readFileSync(mainPath, 'utf8');
  let idx = 0;
  let count = 0;
  const term = 'limited';
  while (true) {
    idx = content.toLowerCase().indexOf(term, idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 80);
    const end = Math.min(content.length, idx + term.length + 80);
    console.log(`[MATCH #${count}] Index: ${idx}`);
    console.log(content.substring(start, end).replace(/\r?\n/g, ' '));
    idx += term.length;
  }
} else {
  console.log('jetskiAgent/main.js.bak not found');
}
