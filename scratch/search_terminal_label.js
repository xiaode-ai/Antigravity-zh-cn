import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

function searchPattern(content, name) {
  if (!content) return;
  console.log(`\n=== Searching in ${name} ===`);
  const queries = [
    'background processes running',
    'processes running',
    'background processes',
    'background process',
    'Terminal (',
    'Terminal'
  ];
  
  queries.forEach(q => {
    let index = 0;
    let count = 0;
    while (true) {
      const idx = content.indexOf(q, index);
      if (idx === -1) break;
      count++;
      if (count <= 5) {
        const start = Math.max(0, idx - 100);
        const end = Math.min(content.length, idx + q.length + 100);
        console.log(`[${q}] #${count} at ${idx}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
      }
      index = idx + 1;
    }
    console.log(`Total for ${q}: ${count}`);
  });
}

searchPattern(mainContent, 'main.js');
searchPattern(wbContent, 'workbench.desktop.main.js');
