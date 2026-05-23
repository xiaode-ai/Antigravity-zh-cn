import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

function findErrorContexts(content, filename) {
  console.log(`\n=== Scanning ${filename} ===`);
  const patterns = [
    'children:"Error"',
    'children:\'Error\'',
    'title:"Error"',
    'title:\'Error\'',
    'label:"Error"',
    'label:\'Error\'',
    'text:"Error"',
    'text:\'Error\'',
    '"Error"'
  ];

  patterns.forEach(pat => {
    let idx = 0;
    let occurrences = [];
    while (true) {
      idx = content.indexOf(pat, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + pat.length + 100);
      occurrences.push({ pos: idx, context: content.substring(start, end).replace(/\r?\n/g, ' ') });
      idx += pat.length;
      if (occurrences.length >= 20) {
        occurrences.push({ pos: -1, context: '... limit of 20 exceeded ...' });
        break;
      }
    }
    
    if (occurrences.length > 0) {
      console.log(`\nPattern: ${pat} (${occurrences.length} matches):`);
      occurrences.forEach((occ, i) => {
        console.log(`  [${i+1}] Pos ${occ.pos}: ${occ.context}`);
      });
    }
  });
}

findErrorContexts(mainContent, 'main.js.bak');
findErrorContexts(wbContent, 'workbench.desktop.main.js.bak');
