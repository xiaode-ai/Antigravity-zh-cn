import fs from 'fs';
import path from 'path';

const files = [
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js"
];

const terms = [
  "Accept Changes",
  "Edited files",
  "edited file",
  "Searched"
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n========================================`);
  console.log(`FILE: ${path.basename(filePath)}`);
  console.log(`========================================`);
  
  for (const term of terms) {
    let index = 0;
    let count = 0;
    while (true) {
      index = content.indexOf(term, index);
      if (index === -1) break;
      
      count++;
      console.log(`  [Match ${count}] Term: "${term}" at Pos ${index}`);
      // Show 150 chars before and 150 chars after
      const start = Math.max(0, index - 150);
      const end = Math.min(content.length, index + term.length + 150);
      const snippet = content.substring(start, end).replace(/\n/g, ' ');
      console.log(`  Snippet: ${snippet}\n`);
      
      index += term.length;
    }
  }
}
