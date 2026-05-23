import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.readFileSync(wbPath, 'utf8');

const targetIdx = 13869465;
const start = Math.max(0, targetIdx - 300);
const end = Math.min(wbContent.length, targetIdx + 300);
console.log('Context of "Show {0} more..." in workbench:');
console.log(wbContent.substring(start, end));
