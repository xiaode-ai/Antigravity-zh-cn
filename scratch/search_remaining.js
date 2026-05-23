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
  { name: 'extension.js (current)', path: path.join(extensionDir, 'extension.js') },
  { name: 'nls.messages.json.bak', path: path.join(outDir, 'nls.messages.json.bak') },
  { name: 'nls.messages.json (current)', path: path.join(outDir, 'nls.messages.json') }
];

const targetTerms = [
  'Accept Changes',
  'Edited files',
  'View 3 edited files', // also search for 'edited file' and 'View'
  'edited file',
  'Error',
  'Searched'
];

function searchInFiles() {
  for (const file of filesToCheck) {
    if (!fs.existsSync(file.path)) {
      console.log(`File not found: ${file.name} at ${file.path}`);
      continue;
    }
    const content = fs.readFileSync(file.path, 'utf8');
    console.log(`\n================ SEARCHING IN ${file.name} ================`);
    
    for (const term of targetTerms) {
      let index = 0;
      let count = 0;
      console.log(`\n  --- Term: "${term}" ---`);
      while (true) {
        index = content.indexOf(term, index);
        if (index === -1) break;
        count++;
        
        // Print context
        const start = Math.max(0, index - 80);
        const end = Math.min(content.length, index + term.length + 80);
        const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
        console.log(`  [Match ${count}] Pos: ${index}`);
        console.log(`  Snippet: ... ${snippet} ...`);
        
        index += term.length;
      }
      if (count === 0) {
        console.log(`  No matches found.`);
      }
    }
  }
}

searchInFiles();
