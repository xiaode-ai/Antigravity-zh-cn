import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainContent = fs.readFileSync(path.join(outDir, 'jetskiAgent', 'main.js.bak'), 'utf8');
const wbContent = fs.readFileSync(path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'utf8');

const idx1 = mainContent.indexOf('Submit (Enter)');
console.log('MAIN.JS.BAK EXACT CONTEXT:');
console.log(mainContent.substring(idx1 - 100, idx1 + 200));

const idx2 = wbContent.indexOf('Submit (Enter)');
console.log('\nWORKBENCH.DESKTOP.MAIN.JS.BAK EXACT CONTEXT:');
console.log(wbContent.substring(idx2 - 100, idx2 + 200));
