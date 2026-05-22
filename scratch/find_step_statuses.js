import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

function findExactContext(content, term, name) {
  console.log(`\n=== Context for "${term}" in ${name} ===`);
  let idx = 0;
  let count = 0;
  while(true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    count++;
    if (count <= 5) {
      console.log(`Occur #${count} (Index ${idx}):`);
      console.log(`   ...${content.substring(idx - 150, idx + term.length + 150).replace(/\r?\n/g, ' ')}...`);
    }
    idx += term.length;
  }
}

findExactContext(mainContent, 'Analyzed', 'main.js');
findExactContext(wbContent, 'Analyzed', 'workbench');

findExactContext(mainContent, 'Edited', 'main.js');
findExactContext(wbContent, 'Edited', 'workbench');

findExactContext(mainContent, 'Ran', 'main.js');
findExactContext(wbContent, 'Ran', 'workbench');

findExactContext(mainContent, 'Working', 'main.js');
findExactContext(wbContent, 'Working', 'workbench');
