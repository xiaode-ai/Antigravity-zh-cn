import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainContent = fs.readFileSync(path.join(outDir, 'jetskiAgent', 'main.js.bak'), 'utf8');
const wbContent = fs.readFileSync(path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'utf8');

const idx1 = mainContent.indexOf('Comment (');
console.log('MAIN.JS.BAK EXACT CONTEXT:');
console.log(mainContent.substring(idx1 - 30, idx1 + 70));

const idx2 = wbContent.indexOf('Comment (');
console.log('\nWORKBENCH.DESKTOP.MAIN.JS.BAK EXACT CONTEXT:');
console.log(wbContent.substring(idx2 - 30, idx2 + 70));
