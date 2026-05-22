import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

function printMatches(filePath, name, term) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = 0;
  let count = 0;
  console.log(`\n=== Matches for "${term}" in ${name} ===`);
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + term.length + 100);
    console.log(`[${count}] Index ${idx}:`);
    console.log(`  Context: ${content.substring(start, end).replace(/\r?\n/g, ' ')}`);
    idx += term.length;
  }
}

printMatches(mainPath, 'jetskiAgent/main.js.bak', 'Code Context Items');
printMatches(wbPath, 'workbench.desktop.main.js.bak', 'Code Context Items');

printMatches(mainPath, 'jetskiAgent/main.js.bak', 'Directories');
printMatches(wbPath, 'workbench.desktop.main.js.bak', 'Directories');
