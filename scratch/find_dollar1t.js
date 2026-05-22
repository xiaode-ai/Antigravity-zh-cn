import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(filePath, 'utf8');

function findWithContext(term, before = 100, after = 500) {
  let idx = 0;
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    console.log(`\nFound "${term}" at index ${idx}:`);
    console.log(content.substring(idx - before, idx + after));
    idx += term.length;
  }
}

findWithContext('$1t', 100, 500);
