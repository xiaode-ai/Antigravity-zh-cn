import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'main.js');

const targetTerms = [
  'Accept Changes',
  'Edited files',
  'edited file',
  'children:"Error"',
  'label:"Error"',
  'text:"Error"',
  'Searched'
];

function search() {
  if (!fs.existsSync(mainPath)) {
    console.log('out/main.js not found.');
    return;
  }
  const content = fs.readFileSync(mainPath, 'utf8');
  console.log(`=== Searching in out/main.js ===`);
  
  for (const term of targetTerms) {
    let index = 0;
    let count = 0;
    console.log(`\n  --- Term: "${term}" ---`);
    while (true) {
      index = content.indexOf(term, index);
      if (index === -1) break;
      count++;
      const start = Math.max(0, index - 80);
      const end = Math.min(content.length, index + term.length + 120);
      console.log(`  [Match ${count}] Pos: ${index} | Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
      index += term.length;
    }
    if (count === 0) {
      console.log(`  None found.`);
    }
  }
}

search();
