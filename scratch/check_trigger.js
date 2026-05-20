import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(targetPath, 'utf8');

console.log('=== 检测主运行库 main.js 中 qne Trigger 的编译现状 ===');

let idx = 0;
let count = 0;
while ((idx = content.indexOf('className:"capitalize"', idx)) !== -1) {
  count++;
  console.log(`[Occurrence ${count}] index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 300));
  idx += 'className:"capitalize"'.length;
}
