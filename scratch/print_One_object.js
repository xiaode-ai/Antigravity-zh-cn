import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const bakPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const content = fs.readFileSync(bakPath, 'utf8');

const startIdx = content.indexOf('One={');
const endIdx = content.indexOf('};', startIdx);
console.log(content.substring(startIdx, endIdx + 2));
