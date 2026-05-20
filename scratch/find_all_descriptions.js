import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

console.log('=== 查找所有 resolveOptionToDescription 的定义 ===');

let idx = 0;
let occurrences = [];
while ((idx = content.indexOf('resolveOptionToDescription', idx)) !== -1) {
  occurrences.push(idx);
  idx += 'resolveOptionToDescription'.length;
}

occurrences.forEach((pIdx, i) => {
  console.log(`\n[Occurrence ${i+1}] index ${pIdx}:`);
  console.log(content.substring(pIdx - 100, pIdx + 600));
  console.log('-'.repeat(40));
});
