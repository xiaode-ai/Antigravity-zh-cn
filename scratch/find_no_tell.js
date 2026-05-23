import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainContent = fs.readFileSync(path.join(outDir, 'jetskiAgent', 'main.js.bak'), 'utf8');
const wbContent = fs.readFileSync(path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'utf8');

function findIn(content, name, term) {
  let index = 0;
  let count = 0;
  while (true) {
    const foundIndex = content.toLowerCase().indexOf(term.toLowerCase(), index);
    if (foundIndex === -1) break;
    count++;
    const start = Math.max(0, foundIndex - 100);
    const end = Math.min(content.length, foundIndex + term.length + 100);
    console.log(`[FOUND in ${name}] match #${count} for "${term}" at index ${foundIndex}:`);
    console.log(`   ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    index = foundIndex + 1;
    if (count >= 15) break;
  }
}

findIn(mainContent, 'main.js.bak', 'tell the agent');
findIn(mainContent, 'main.js.bak', 'do instead');
findIn(mainContent, 'main.js.bak', 'No (');
findIn(wbContent, 'workbench.desktop.main.js.bak', 'tell the agent');
findIn(wbContent, 'workbench.desktop.main.js.bak', 'do instead');
findIn(wbContent, 'workbench.desktop.main.js.bak', 'No (');
