import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(targetPath, 'utf8');

console.log('=== 检测编译后的 main.js 中 options:["read","edit"] 实际代码 ===');

let idx = 0;
let count = 0;
while ((idx = content.indexOf('options:["read","edit"]', idx)) !== -1) {
  count++;
  console.log(`\n[Occurrence ${count}] index ${idx}:`);
  console.log(content.substring(idx - 150, idx + 250));
  idx += 'options:["read","edit"]'.length;
}
