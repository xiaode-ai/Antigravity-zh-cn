import fs from 'fs';
import path from 'path';

const filePath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js";
if (!fs.existsSync(filePath)) {
  console.log(`File not found: ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

const terms = [
  "Accept Changes",
  "Edited files",
  "edited file",
  "Error",
  "Searched"
];

for (const term of terms) {
  let index = 0;
  let count = 0;
  console.log(`=== Matches for "${term}" ===`);
  while (true) {
    index = content.indexOf(term, index);
    if (index === -1) break;
    
    count++;
    const start = Math.max(0, index - 80);
    const end = Math.min(content.length, index + term.length + 80);
    const snippet = content.substring(start, end).replace(/\n/g, ' ');
    console.log(`Match ${count} at Pos ${index}:`);
    console.log(`Snippet: ... ${snippet} ...\n`);
    
    index += term.length;
  }
}
