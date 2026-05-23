import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const targets = [
  'Accept Changes',
  'Edited files',
  'edited files',
  'View ',
  'Error',
  'Searched'
];

function scanFile(content, filename) {
  console.log(`\n================== SCANNING ${filename} ==================`);
  targets.forEach(target => {
    let idx = 0;
    let occurrences = [];
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + target.length + 100);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      occurrences.push({ pos: idx, context });
      idx += target.length;
      if (occurrences.length >= 40) {
        occurrences.push({ pos: -1, context: `... total matches exceeded 40 ...` });
        break;
      }
    }
    
    if (occurrences.length > 0) {
      console.log(`\n--- "${target}" (${occurrences.length} matches):`);
      occurrences.forEach((occ, i) => {
        console.log(`  [${i+1}] Pos ${occ.pos}: ${occ.context}`);
      });
    }
  });
}

scanFile(mainContent, 'main.js.bak');
scanFile(wbContent, 'workbench.desktop.main.js.bak');
