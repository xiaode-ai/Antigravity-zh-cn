import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbContent = fs.readFileSync(path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'utf8');
const mainContent = fs.readFileSync(path.join(outDir, 'main.js.bak'), 'utf8');

const idxWb = wbContent.indexOf('TAu={read_file');
if (idxWb !== -1) {
  console.log('--- vs/workbench/workbench.desktop.main.js.bak ---');
  console.log(wbContent.substring(idxWb, idxWb + 400));
}

const idxMain = mainContent.indexOf('r7a={read_file');
if (idxMain !== -1) {
  console.log('\n--- out/main.js.bak ---');
  console.log(mainContent.substring(idxMain, idxMain + 400));
}
