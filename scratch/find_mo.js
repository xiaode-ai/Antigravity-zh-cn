import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainPath, 'utf8');

function find(term) {
  let idx = 0;
  while (true) {
    idx = mainContent.indexOf(term, idx);
    if (idx === -1) break;
    console.log(`Found "${term}" at index ${idx}:`);
    console.log(mainContent.substring(idx - 100, idx + 500));
    idx += term.length;
  }
}

find(',MO=');
find(';MO=');
find('var MO=');
find('let MO=');
find('const MO=');
find('function MO');
