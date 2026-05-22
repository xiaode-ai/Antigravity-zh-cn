import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.readFileSync(wbPath, 'utf8');

console.log('=== AROUND PLURALS (14557470) ===');
console.log(wbContent.substring(14557300, 14557600));

console.log('\n=== AROUND PLURALS (9775359) ===');
console.log(wbContent.substring(9775200, 9775500));
