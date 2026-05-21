import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const filePath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

if (!fs.existsSync(filePath)) {
  console.log(`[File Not Found] ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
let idx = 0;
let count = 0;
const term = 'limit';
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
