import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const targets = ['.BROWSER="Browser"', '.BROWSER=\'Browser\''];

targets.forEach(t => {
  console.log(`\n=== main.js.bak for ${t} ===`);
  let idx = 0;
  while (true) {
    idx = mainContent.indexOf(t, idx);
    if (idx === -1) break;
    console.log(`Found at ${idx}: ${mainContent.substring(idx - 100, idx + t.length + 100)}`);
    idx += t.length;
  }
  
  console.log(`\n=== workbench.desktop.main.js.bak for ${t} ===`);
  idx = 0;
  while (true) {
    idx = wbContent.indexOf(t, idx);
    if (idx === -1) break;
    console.log(`Found at ${idx}: ${wbContent.substring(idx - 100, idx + t.length + 100)}`);
    idx += t.length;
  }
});
