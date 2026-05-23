import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';

function searchInFile(filePath, name) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  
  const literals = ['"Ran"', "'Ran'", '`Ran`'];
  literals.forEach(lit => {
    let idx = 0;
    while (true) {
      idx = content.indexOf(lit, idx);
      if (idx === -1) break;
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + lit.length + 100);
      const chunk = content.substring(start, end).replace(/\n/g, ' ');
      console.log(`[${name}] Found ${lit} at ${idx}: ... ${chunk} ...`);
      idx += lit.length;
    }
  });
}

searchInFile(mainPath, 'main.js');
searchInFile(wbPath, 'workbench');
searchInFile(extPath, 'extension');
