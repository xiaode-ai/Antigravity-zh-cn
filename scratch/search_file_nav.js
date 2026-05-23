import fs from 'fs';
import path from 'path';

const files = [
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js",
  "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js"
];

const terms = [
  "_fileNavDisplayText",
  "_centerButton",
  "All Edited Files Reviewed",
  "All edited files reviewed",
  "View 3 edited files"
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`=== ${path.basename(filePath)} ===`);
  for (const term of terms) {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      count++;
      console.log(`  [${term}] Match ${count} at pos ${idx}:`);
      console.log(`  Snippet: ${content.substring(idx - 100, idx + 100).replace(/\n/g, ' ')}`);
      idx += term.length;
    }
  }
}
