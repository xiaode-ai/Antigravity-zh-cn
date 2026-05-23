import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

function findEditedFiles(content, filename) {
  console.log(`\n=== Scanning ${filename} ===`);
  const regex = /edited\s*files/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const start = Math.max(0, match.index - 150);
    const end = Math.min(content.length, match.index + match[0].length + 150);
    console.log(`Pos ${match.index}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  }
}

findEditedFiles(mainContent, 'main.js.bak');
findEditedFiles(wbContent, 'workbench.desktop.main.js.bak');
