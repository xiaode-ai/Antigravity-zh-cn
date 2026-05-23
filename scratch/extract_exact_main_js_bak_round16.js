import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';

const targets = [
  'Accept Changes',
  'Edited files',
  'edited files',
  'View ',
  'Error',
  'Searched'
];

let out = [];
targets.forEach(target => {
  let idx = 0;
  let occurrences = [];
  while (true) {
    idx = mainContent.indexOf(target, idx);
    if (idx === -1) break;
    
    const start = Math.max(0, idx - 120);
    const end = Math.min(mainContent.length, idx + target.length + 120);
    const context = mainContent.substring(start, end).replace(/\r?\n/g, ' ');
    occurrences.push({ pos: idx, context });
    idx += target.length;
    if (occurrences.length >= 40) {
      occurrences.push({ pos: -1, context: `... total matches exceeded 40 ...` });
      break;
    }
  }
  
  if (occurrences.length > 0) {
    out.push(`--- "${target}" (${occurrences.length} matches):`);
    occurrences.forEach((occ, i) => {
      out.push(`  [${i+1}] Pos ${occ.pos}: ${occ.context}`);
    });
  }
});

fs.writeFileSync('scratch/main_js_bak_matches_round16.txt', out.join('\n'), 'utf8');
console.log('Done!');
