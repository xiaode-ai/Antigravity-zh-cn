import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(filePath, 'utf8');

const startIdx = 9866124 + 7950;
const endIdx = startIdx + 2000;

console.log(content.substring(startIdx, endIdx));
