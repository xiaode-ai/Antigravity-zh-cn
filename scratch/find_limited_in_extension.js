import fs from 'fs';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';
const content = fs.readFileSync(extPath, 'utf8');

const regex = /(?<!de)limited\b/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const idx = match.index;
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + match[0].length + 100);
  console.log(`Found "${match[0]}" in extension.js at index ${idx}:`);
  console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
}
