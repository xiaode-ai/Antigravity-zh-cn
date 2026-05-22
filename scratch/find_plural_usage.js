import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

function printUsage(content, name, varName) {
  if (!content) return;
  let idx = 0;
  console.log(`=== USAGE OF ${varName} IN ${name} ===`);
  while (true) {
    idx = content.indexOf(varName, idx);
    if (idx === -1) break;
    console.log(`Index ${idx}:`);
    console.log(content.substring(idx - 100, idx + 100));
    idx += varName.length;
  }
}

printUsage(mainContent, 'main.js.bak', 'Ebn');
printUsage(wbContent, 'workbench.desktop.main.js.bak', 'dOo');
