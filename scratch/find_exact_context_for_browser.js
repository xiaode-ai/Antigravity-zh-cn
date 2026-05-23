import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const targets = [
  'Screenshot',
  'Console logs',
  "Pages currently open in Antigravity's Browser instance are shown below.",
  'Recent actions',
  'Working directory: ',
  'all changes to the below files',
  'hunks of',
  'all changes to',
  'Active Browser pages',
  'Mention Page',
  'Capture screenshot',
  'Capture console logs',
  'Taking Screenshot',
  'Took Screenshot',
  'Capturing',
  'Screenshot must be under 10 MB',
  't.BROWSER="Browser"',
  'text:"Browser"'
];

function scanFile(content, filename) {
  console.log(`\n================== SCANNING ${filename} ==================`);
  targets.forEach(target => {
    let idx = 0;
    let occurrences = [];
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 80);
      const end = Math.min(content.length, idx + target.length + 80);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      occurrences.push({ pos: idx, context });
      idx += target.length;
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
