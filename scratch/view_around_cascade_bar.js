import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const content = fs.readFileSync(wbPath, 'utf8');

// Print around 18744763
const start = 18744000;
const end = 18746000;
console.log(content.substring(start, end));
