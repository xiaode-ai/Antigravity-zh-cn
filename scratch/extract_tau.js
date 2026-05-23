import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainContent = fs.readFileSync(path.join(outDir, 'jetskiAgent', 'main.js.bak'), 'utf8');
const wbContent = fs.readFileSync(path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'utf8');
const oldMainContent = fs.readFileSync(path.join(outDir, 'main.js.bak'), 'utf8');

function showAround(content, name, term) {
  const idx = content.indexOf(term);
  if (idx !== -1) {
    console.log(`\n=================== ${name} ===================`);
    console.log(content.substring(idx - 150, idx + 250));
  } else {
    console.log(`\n=================== ${name} NOT FOUND ===================`);
  }
}

showAround(mainContent, 'jetskiAgent/main.js.bak', 'read access to this path');
showAround(wbContent, 'vs/workbench/workbench.desktop.main.js.bak', 'read access to this path');
showAround(oldMainContent, 'main.js.bak', 'read access to this path');
