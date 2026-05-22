import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(mainPath, 'utf8');

const regex = /limited|Limited/gi;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  const idx = match.index;
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + match[0].length + 100);
  console.log(`[${count}] Match: "${match[0]}" at index ${idx}`);
  console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
}
