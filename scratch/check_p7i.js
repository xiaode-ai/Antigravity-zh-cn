import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

console.log('=== 检测 main.js.bak 中 options:["allow","ask","deny"] 的各处细节 ===');

const targetStr = 'options:["allow","ask","deny"]';
let idx = 0;
let count = 0;
while ((idx = content.indexOf(targetStr, idx)) !== -1) {
  count++;
  console.log(`\n[Occurrence ${count}] index ${idx}:`);
  console.log(content.substring(idx - 150, idx + 250));
  idx += targetStr.length;
}
