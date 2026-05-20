import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(mainPath, 'utf8');

const targetStr = '您的方案';
let idx = 0;
let count = 0;
while (true) {
  idx = content.indexOf(targetStr, idx);
  if (idx === -1) break;
  count++;
  console.log(`[Occurrence ${count}] Index: ${idx}`);
  console.log(content.substring(idx - 100, idx + 400));
  console.log('-'.repeat(40));
  idx += targetStr.length;
}
