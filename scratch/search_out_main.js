import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'main.js');

const targetTerms = [
  'Accept Changes',
  'Edited files',
  'View 3 edited files',
  'edited file',
  'Error',
  'Searched'
];

function search() {
  if (!fs.existsSync(mainPath)) {
    console.log('out/main.js not found.');
    return;
  }
  const content = fs.readFileSync(mainPath, 'utf8');
  console.log(`=== Searching in out/main.js (${(content.length/1024/1024).toFixed(2)} MB) ===`);
  
  for (const term of targetTerms) {
    let index = 0;
    let count = 0;
    while (true) {
      index = content.indexOf(term, index);
      if (index === -1) break;
      count++;
      const start = Math.max(0, index - 80);
      const end = Math.min(content.length, index + term.length + 120);
      console.log(`  [Match ${count}] Term: "${term}" | Pos: ${index} | Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
      index += term.length;
    }
    if (count === 0) {
      console.log(`  Term: "${term}" - None found.`);
    }
  }
}

search();
