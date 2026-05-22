import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

function findPrecise(content, term, name) {
  console.log(`=== "${term}" in ${name} ===`);
  let idx = 0;
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    console.log(`   ...${content.substring(idx - 100, idx + term.length + 100).replace(/\r?\n/g, ' ')}...`);
    idx += term.length;
  }
}

findPrecise(mainContent, 'Changes Overview', 'main.js');
findPrecise(wbContent, 'Changes Overview', 'workbench');

findPrecise(mainContent, 'With Changes', 'main.js');
findPrecise(wbContent, 'With Changes', 'workbench');
