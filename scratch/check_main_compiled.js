import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(targetPath, 'utf8');

console.log('=== 检测编译后的 main.js 中的 displayResolver 实际代码 ===');

// 搜索 allow, ask, deny 相关的 qne 调用
let idx = 0;
let count = 0;
while ((idx = content.indexOf('options:["allow","ask","deny"]', idx)) !== -1) {
  count++;
  console.log(`\n[Occurrence ${count}] index ${idx}:`);
  console.log(content.substring(idx - 150, idx + 250));
  idx += 'options:["allow","ask","deny"]'.length;
}
