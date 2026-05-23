import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const extensionDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist';

const filesToCheck = [
  { name: 'main.js.bak', path: path.join(outDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'main.js (current)', path: path.join(outDir, 'jetskiAgent', 'main.js') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') },
  { name: 'workbench.desktop.main.js (current)', path: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js') },
  { name: 'extension.js.bak', path: path.join(extensionDir, 'extension.js.bak') },
  { name: 'extension.js (current)', path: path.join(extensionDir, 'extension.js') }
];

const targetTerms = [
  'Accept Changes',
  'Edited files',
  'View 3 edited files',
  'Error',
  'Searched'
];

function summarize() {
  const summary = {};
  
  for (const file of filesToCheck) {
    if (!fs.existsSync(file.path)) {
      summary[file.name] = 'NOT FOUND';
      continue;
    }
    const content = fs.readFileSync(file.path, 'utf8');
    summary[file.name] = {};
    
    for (const term of targetTerms) {
      let count = 0;
      let index = 0;
      while (true) {
        index = content.indexOf(term, index);
        if (index === -1) break;
        count++;
        index += term.length;
      }
      summary[file.name][term] = count;
    }
  }
  
  console.log(JSON.stringify(summary, null, 2));
}

summarize();
