import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';
const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const extContent = fs.existsSync(extPath) ? fs.readFileSync(extPath, 'utf8') : '';

function searchSnooze(content, name) {
  if (!content) return;
  console.log(`\n=== Snooze IN ${name} ===`);
  let idx = 0;
  let matches = [];
  while (true) {
    const nextIdx = content.indexOf('Snooze', idx);
    if (nextIdx === -1) break;
    matches.push(nextIdx);
    idx = nextIdx + 1;
  }
  matches.forEach((pos, i) => {
    const start = Math.max(0, pos - 80);
    const end = Math.min(content.length, pos + 86);
    console.log(`  [#${i+1}] At ${pos}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  });
}

searchSnooze(mainContent, 'main.js');
searchSnooze(wbContent, 'workbench.desktop.main.js');
searchSnooze(extContent, 'extension.js');
