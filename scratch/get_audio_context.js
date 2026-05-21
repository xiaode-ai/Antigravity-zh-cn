import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

function showContext(filePath, name) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = content.indexOf('Record Audio');
  if (idx !== -1) {
    console.log(`\n=== ${name} ===`);
    console.log(content.substring(idx - 100, idx + 300));
  }
}

showContext(wbPath, 'workbench.desktop.main.js.bak');
showContext(mainPath, 'jetskiAgent/main.js.bak');
