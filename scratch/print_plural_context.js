import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

function printContext(content, name) {
  if (!content) return;
  const idx = content.indexOf('web:["page","pages"]');
  if (idx !== -1) {
    console.log(`=== ${name} ===`);
    console.log(content.substring(idx - 150, idx + 250));
  }
}

printContext(mainContent, 'main.js.bak');
printContext(wbContent, 'workbench.desktop.main.js.bak');
