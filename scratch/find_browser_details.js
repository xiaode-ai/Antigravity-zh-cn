import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const searchTerms = [
  "Screenshot",
  "Console logs",
  "Pages currently open in Antigravity's Browser instance are shown below."
];

function search(content, name, terms) {
  console.log(`\n=== Searching in ${name} ===`);
  terms.forEach(term => {
    let index = 0;
    let count = 0;
    while (true) {
      const idx = content.indexOf(term, index);
      if (idx === -1) break;
      count++;
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + term.length + 150);
      console.log(`[${term}] #${count} at ${idx}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
      index = idx + term.length;
    }
    console.log(`Total for "${term}": ${count}`);
  });
}

search(mainContent, 'main.js.bak', searchTerms);
search(wbContent, 'workbench.desktop.main.js.bak', searchTerms);
