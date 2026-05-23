import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log('=== workbench.desktop.main.js ===');
const wbIdx = wbContent.indexOf('Background Process');
if (wbIdx !== -1) {
  console.log(`Found "Background Process" at index ${wbIdx} in workbench.desktop.main.js`);
  console.log(wbContent.substring(wbIdx - 150, wbIdx + 150));
}

console.log('\n=== main.js ===');
const mainIdx = mainContent.indexOf('Background Process');
if (mainIdx !== -1) {
  console.log(`Found "Background Process" at index ${mainIdx} in main.js`);
  console.log(mainContent.substring(mainIdx - 150, mainIdx + 150));
} else {
  console.log('Not found in main.js');
}
