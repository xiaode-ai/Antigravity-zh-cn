import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainPath, 'utf8');

const targetIdx = 9121247;
const start = Math.max(0, targetIdx - 300);
const end = Math.min(mainContent.length, targetIdx + 300);
console.log('Context of "Show {0} more...":');
console.log(mainContent.substring(start, end));
