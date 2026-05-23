import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const targets = [
  'Accept Changes',
  'Accept changes',
  'Edited files',
  'edited files',
  'View',
  'Error',
  'Searched'
];

function scanFile(content, filename) {
  let out = [`=== ${filename} ===`];
  targets.forEach(target => {
    let idx = 0;
    let occurrences = [];
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 200);
      const end = Math.min(content.length, idx + target.length + 200);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      occurrences.push({ pos: idx, context });
      idx += target.length;
      if (occurrences.length >= 100) {
        occurrences.push({ pos: -1, context: `... total matches exceeded 100 ...` });
        break;
      }
    }
    
    if (occurrences.length > 0) {
      out.push(`\nTarget: "${target}" (${occurrences.length} matches):`);
      occurrences.forEach((occ, i) => {
        out.push(`  [${i+1}] Pos ${occ.pos}: ... ${occ.context} ...`);
      });
    }
  });
  return out.join('\n');
}

const mainResult = scanFile(mainContent, 'main.js.bak');
const wbResult = scanFile(wbContent, 'workbench.desktop.main.js.bak');

fs.writeFileSync('scratch/all_precise_matches_round16.txt', mainResult + '\n\n\n' + wbResult, 'utf8');
console.log('Finished writing to scratch/all_precise_matches_round16.txt!');
