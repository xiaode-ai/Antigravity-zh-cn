import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

function findBrowserInCompiled(content, name) {
  console.log(`\n=== "Browser" in ${name} ===`);
  const query = 'Browser';
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(query, idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + query.length + 100);
    const chunk = content.substring(start, end).replace(/\r?\n/g, ' ');
    // Filter to potential UI context (e.g. quotes around it, label/title)
    if (chunk.includes('"Browser"') || chunk.includes("'Browser'") || chunk.includes('Browser:')) {
      console.log(`[Browser] #${count} at ${idx}: ... ${chunk} ...`);
    }
    idx += query.length;
  }
}

findBrowserInCompiled(mainContent, 'main.js');
findBrowserInCompiled(wbContent, 'workbench.desktop.main.js');
