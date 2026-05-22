import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainPath, 'utf8');

function find(term) {
  let idx = 0;
  const matches = [];
  while (true) {
    idx = mainContent.indexOf(term, idx);
    if (idx === -1) break;
    matches.push(idx);
    idx += term.length;
  }
  console.log(`Found "${term}" at ${matches.length} positions: ${matches.slice(0, 10).join(', ')}`);
}

find('oRn=');
find('JO=');
find('oRn');
find('JO');
